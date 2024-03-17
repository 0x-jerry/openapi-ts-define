import tsm, { Project, Node, SyntaxKind } from 'ts-morph'
import fg from 'fast-glob'
import path from 'path'
import type { RouteConfig, RouteReqeustQuery } from './types'
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

  getRequestParameters(typeNode: tsm.TypeNode) {
    const reqType = this.getTypeNode(typeNode)

    if (!reqType) {
      return
    }

    const members = reqType.getMembers()

    const query = members.find((n) => Node.isPropertySignature(n) && n.getName() === 'query')
    const params = members.find((n) => Node.isPropertySignature(n) && n.getName() === 'params')
    const body = members.find((n) => Node.isPropertySignature(n) && n.getName() === 'body')

    const queryNames = this.parseSimpleObjectType(
      query?.asKind(SyntaxKind.PropertySignature)?.getTypeNode()
    )

    const paramsNames = this.parseSimpleObjectType(
      params?.asKind(SyntaxKind.PropertySignature)?.getTypeNode()
    )

    return {
      query: queryNames,
      params: paramsNames,
      body: this.typeToSchema(body),
    }
  }

  typeToSchema(typeNode?: tsm.Node) {
    if (!typeNode) return
    return toSchema(typeNode, this.schemaContext)
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
    }

    if (Node.isTypeLiteral(node)) {
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

    const args = initializer.getTypeArguments()

    const [reqArg, respArg] = args.map((item) => item)

    return {
      request: reqArg as tsm.TypeNode | undefined,
      response: respArg as tsm.TypeNode | undefined,
    }
  }

  parseSimpleObjectType(type?: tsm.TypeNode): RouteReqeustQuery[] {
    const names: RouteReqeustQuery[] = []

    if (!type) {
      return names
    }

    if (!Node.isTypeLiteral(type)) {
      return names
    }

    const members = type.getMembers()

    for (const member of members) {
      if (!Node.isPropertySignature(member)) {
        continue
      }

      const isOptional = member.getQuestionTokenNode()

      names.push({
        name: member.getName(),
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

function convertToUrlPath(relativeFilePath: string) {
  const parsedPath = path.parse(relativeFilePath)
  // todo, parse request params
  const urlSegments = parsedPath.dir.split(path.sep)

  if (parsedPath.name !== 'index') {
    urlSegments.push(parsedPath.name)
  }

  let urlPath = urlSegments.join('/')
  urlPath = urlPath[0] === '/' ? urlPath : '/' + urlPath

  return {
    path: urlPath,
  }
}
