import tsm, { Project } from 'ts-morph'
import fg from 'fast-glob'
import path from 'path'
import type { RouteConfig, RouteRequestParam } from './types'
import type { ToSchemaContext } from './schemas/types'
import { toSchema } from './schemas/schema'
import { toArray } from '@0x-jerry/utils'
import type { RouteInfoExtractor } from './extractor/types'
import nitroExtractor from './extractor/nitro'
import { RefsManager, getDocument } from './schemas/utils'

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
      refs: new RefsManager(),
      nodeStack: [],
    }
  }

  parse(opt: ApiRoutesConfig) {
    const extractor = opt.routeInfoExtractor ?? nitroExtractor

    const files = fg.sync(opt.files, { cwd: opt.root })

    for (const file of files) {
      const config = this.parseApiRouteFile(file, opt.root, extractor)

      this.routes.push(...config)
    }
  }

  parseApiRouteFile(relativeFilePath: string, root: string, extractor: RouteInfoExtractor) {
    const project = this.project

    const filePath = path.join(root, relativeFilePath)

    const routeSourceFile = project.getSourceFileOrThrow(filePath)

    const routeInfos = extractor(routeSourceFile, {
      path: relativeFilePath,
      project,
    })

    if (!routeInfos) return []

    return toArray(routeInfos).map((routeInfo) => {
      const typeParams = this.getRouteTypes(routeInfo.routeDefineAST)

      const reqConfig = typeParams.request
        ? this.getRequestParameters(typeParams.request)
        : undefined

      const routeConfig: RouteConfig = {
        path: routeInfo.path,
        method: routeInfo.method,
        request: reqConfig,
        response: this.typeToSchema(typeParams.response),
      }

      return routeConfig
    })
  }

  getRequestParameters(typeNode: tsm.Type) {
    const getNodeType = (query?: tsm.Symbol) =>
      query?.getTypeAtLocation(typeNode.getSymbol()?.getDeclarations().at(0)!)

    const query = typeNode.getProperty('query')
    const params = typeNode.getProperty('params')
    const body = typeNode.getProperty('body')

    const queryNames = parseSimpleObjectType(getNodeType(query))

    const paramsNames = parseSimpleObjectType(getNodeType(params))

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
  }

  getRouteTypes(fnExpression: tsm.CallExpression) {
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
      .getResolvedSignature(fnExpression)
      ?.getParameters()
      .at(0)
      ?.getTypeAtLocation(fnExpression)
      .getTypeArguments()

    const reqArg = args?.at(0)
    const respArg = args?.at(1)

    return {
      request: reqArg,
      response: respArg,
    }
  }
}

function parseSimpleObjectType(type?: tsm.Type): RouteRequestParam[] {
  const names: RouteRequestParam[] = []

  if (!type) {
    return names
  }

  const props = type.getProperties()

  for (const property of props) {
    const isOptional = property.isOptional()
    const description = getDocument(property)

    names.push({
      name: property.getName(),
      description,
      optional: !!isOptional,
    })
  }

  return names
}

export interface ApiRoutesConfig {
  root: string
  /**
   * glob pattern
   */
  files: string[]
  routeInfoExtractor?: RouteInfoExtractor
}
