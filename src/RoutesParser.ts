import tsm, { Project, Node, SyntaxKind } from 'ts-morph'
import fg from 'fast-glob'
import path from 'path'
import type { RouteConfig, RouteRequestParam } from './types'
import type { ToSchemaContext } from './schemas/types'
import { toSchema } from './schemas/schema'

export interface RouteParserOption {
  tsconfig: string
}

export class RoutesParser {
  project: Project

  schemaContext: ToSchemaContext

  routes: RouteConfig[] = []

  constructor(option: RouteParserOption) {
    this.project = new tsm.Project({
      tsConfigFilePath: option.tsconfig,
    })

    const cwd = path.resolve(path.dirname(option.tsconfig))

    this.schemaContext = {
      cwd,
      project: this.project,
      refs: new Map(),
      nodeStack: [],
    }
  }

  parse(opt: ApiRoutesConfig) {
    const files = fg.sync(opt.files, { cwd: opt.root })

    for (const file of files) {
      const config = this.parseApiRouteFile(file, opt.root)

      this.routes.push(...config)
    }
  }

  parseApiRouteFile(relativeFilePath: string, root: string) {
    const project = this.project

    const filePath = path.join(root, relativeFilePath)

    const urlPath = convertToUrlPath(relativeFilePath)

    const routeSourceFile = project.getSourceFileOrThrow(filePath)

    const methods = ['get', 'post', 'put', 'delete']

    const exportSymbols = routeSourceFile.getExportSymbols()

    const routesConfig: RouteConfig[] = []

    for (const exportSymbol of exportSymbols) {
      const method = exportSymbol.getName()

      if (!methods.includes(method)) {
        continue
      }

      const typeParams = this.getTypeParams(exportSymbol)

      if (!typeParams) {
        continue
      }

      const reqConfig = typeParams.request
        ? this.getRequestParameters(typeParams.request)
        : undefined

      const routeConfig: RouteConfig = {
        path: urlPath.path,
        method: method,
        request: reqConfig,
        response: this.typeToSchema(typeParams.response),
      }

      routesConfig.push(routeConfig)
    }

    return routesConfig
  }

  getRequestParameters(typeNode: tsm.Type) {
    const getNodeType = (query?: tsm.Symbol) =>
      query?.getTypeAtLocation(typeNode.getSymbol()?.getDeclarations().at(0)!)

    const query = typeNode.getProperty('query')
    const params = typeNode.getProperty('params')
    const body = typeNode.getProperty('body')

    const queryNames = this.parseSimpleObjectType(getNodeType(query))

    const paramsNames = this.parseSimpleObjectType(getNodeType(params))

    return {
      query: queryNames,
      params: paramsNames,
      body: this.typeToSchema(getNodeType(body)),
    }
  }

  typeToSchema(typeNode?: tsm.Type) {
    const node = typeNode?.getSymbol()?.getDeclarations().at(0)

    if (!node) return

    return toSchema(node, this.schemaContext)
    // return toSchema(typeNode, this.schemaContext)
  }

  getTypeNode(node: tsm.Node) {
    let reqType: tsm.InterfaceDeclaration | tsm.TypeLiteralNode | undefined

    if (Node.isTypeReference(node)) {
      const sourceNode = node
        .getTypeName()
        .asKind(SyntaxKind.Identifier)
        ?.getDefinitions()
        .at(0)
        ?.getDeclarationNode()

      if (!sourceNode) return

      if (Node.isTypeAliasDeclaration(sourceNode)) {
        const t = sourceNode.getTypeNode()

        if (Node.isTypeLiteral(t)) {
          reqType = t
        }
      }

      if (Node.isInterfaceDeclaration(sourceNode)) {
        reqType = sourceNode
      }
    } else if (Node.isTypeLiteral(node)) {
      reqType = node
    }

    return reqType
  }

  getTypeParams(exportSymbol: tsm.Symbol) {
    const valueDeclaration = exportSymbol.getValueDeclaration()

    if (!Node.isVariableDeclaration(valueDeclaration)) {
      return
    }

    const initializer = valueDeclaration.getInitializer()

    if (!Node.isCallExpression(initializer)) {
      return
    }

    const tc = this.project.getTypeChecker()
    /**
     * Example parse code:
     *
     * ```ts
     * interface RouteDefinition<Req, Resp> {
     *  (req: Req, ctx: any): Promisable<Resp>
     *}
     *
     * export function defRoute<Req extends RequestParams = {}, Resp extends Record<string, any> = {}>(
     *  fn: RouteDefinition<Req, Resp>
     * ) {}
     *
     * const get = defineRoute((req: RequestType) => {} as ReturnType)
     * ```
     * There are two limitations:
     * 1. A function like `defineRoute` and the first argument should be a function
     * 2. A utils function signature like `RouteDefinition` and it should have two type arguments(Req, Resp).
     */
    const args = tc
      .getResolvedSignature(initializer)
      ?.getParameters()
      .at(0)
      ?.getTypeAtLocation(initializer)
      .getTypeArguments()

    const reqArg = args?.at(0)
    const respArg = args?.at(1)

    return {
      request: reqArg,
      response: respArg,
    }
  }

  parseSimpleObjectType(type?: tsm.Type): RouteRequestParam[] {
    const names: RouteRequestParam[] = []

    if (!type) {
      return names
    }

    const props = type.getProperties()

    for (const property of props) {
      const isOptional = property.isOptional()

      names.push({
        name: property.getName(),
        optional: !!isOptional,
      })
    }

    return names
  }
}

interface ApiRoutesConfig {
  root: string
  /**
   * glob pattern
   */
  files: string[]
}

/**
 *
 * Supported path format:
 *
 * - api/hello.ts => GET /api/hello
 * - api/hello.get.ts => GET /api/hello
 * - api/hello.post.ts => POST /api/hello
 * - api/user/[id].get.ts => GET /api/user/:id
 * - api/user/[id].post.ts => POST /api/user/:id
 * - api/user/[id]/[name].put.ts => PUT /api/user/:id/:name
 *
 * @param relativeFilePath
 * @returns
 */
function convertToUrlPath(relativeFilePath: string) {
  // remove file extension
  relativeFilePath = relativeFilePath.split('.')[0]

  const params: RouteRequestParam[] = []

  const urlSegments = relativeFilePath.split('/').map((part) => {
    if (isPathParam(part)) {
      const name = part.slice(1, -1)
      params.push({
        name,
      })

      return `:${name}`
    } else {
      return part
    }
  })

  const urlPath = '/' + urlSegments.join('/')

  return {
    path: urlPath,
    params,
  }
}

function isPathParam(pathPart: string) {
  return pathPart[0] === '[' && pathPart[pathPart.length - 1] === ']'
}
