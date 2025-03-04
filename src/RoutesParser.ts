import path from 'node:path'
import { ensureArray } from '@0x-jerry/utils'
import fg from 'fast-glob'
import tsm, { Node, type Project } from 'ts-morph'
import nitroExtractor from './extractor/nitro'
import type { RouteInfoExtractor } from './extractor/types'
import { toSchema } from './schemas/schema'
import type { ReferenceManager, ToSchemaContext } from './schemas/types'
import { RefsManager, getDocument } from './schemas/utils'
import type { RouteConfig, RouteRequestParam } from './types'

const ApiTagExtractRegexp = /^\.(?<name>[\w\d]+)\s+(?<value>.+)$/

export interface RouteParserOption {
  tsconfig: string
  refsManager?: ReferenceManager
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
      refs: option.refsManager ?? new RefsManager(),
    }
  }

  parse(opt: ApiRoutesConfig) {
    const extractor = opt.routeInfoExtractor ?? nitroExtractor

    const files = fg.sync(opt.matchFiles, { cwd: opt.routesRoot })

    for (const file of files) {
      const config = this.parseApiRouteFile(file, opt.routesRoot, extractor)

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

    return ensureArray(routeInfos).map((routeInfo) => {
      const typeParams = this.getRouteTypes(routeInfo.routeDefineAST)

      const reqConfig = typeParams.request
        ? this.getRequestParameters(typeParams.request)
        : undefined

      const apiInfo = parseApiInfo(routeInfo.jsTags)

      const routeConfig: RouteConfig = {
        name: apiInfo.name,
        description: routeInfo.description,
        deprecated: hasJsDocTag(routeInfo.jsTags, 'deprecated'),
        path: routeInfo.path,
        method: routeInfo.method,
        request: reqConfig,
        response: this.nodeToSchema(typeParams.response),
        meta: {
          ...apiInfo,
          filepath: relativeFilePath,
        },
      }

      return routeConfig
    })
  }

  getRequestParameters(typeNode: tsm.Type) {
    const currentNode = typeNode.getSymbol()?.getDeclarations().at(0)!
    const getNodeType = (query?: tsm.Symbol) => query?.getTypeAtLocation(currentNode!)

    const query = typeNode.getProperty('query')
    const params = typeNode.getProperty('params')
    const body = typeNode.getProperty('body')

    const queryNames = parseSimpleObjectType(getNodeType(query))

    const paramsNames = parseSimpleObjectType(getNodeType(params))

    return {
      query: queryNames,
      params: paramsNames,
      body: this.nodeToSchema(body),
    }
  }

  nodeToSchema(typeNode?: tsm.Node | tsm.Type | tsm.Symbol) {
    if (!typeNode) return

    const _nodeType = Node.isNode(typeNode)
      ? typeNode.getType()
      : typeNode instanceof tsm.Symbol
        ? typeNode.getTypeAtLocation(typeNode.getDeclarations().at(0)!)
        : typeNode

    if (!_nodeType) return

    return toSchema(_nodeType, this.schemaContext)
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
     * Those need two restriction:
     * 1. A function like `defineRoute` and the first argument should be a function
     * 2. A utils function, and it's signature should like `RouteDefinition` which should have two type arguments(Req, Resp).
     */
    const fnType = tc.getResolvedSignature(fnExpression)

    const fnDeclaration = fnType?.getParameters().at(0)?.getTypeAtLocation(fnExpression)
    let args = fnDeclaration?.getTypeArguments()

    if (!args?.length) {
      args = fnDeclaration?.getAliasTypeArguments()
    }

    const reqArg = args?.at(0)
    const respArg = args?.at(1)

    return {
      node: fnExpression,
      request: reqArg,
      response: respArg,
    }
  }
}

function hasJsDocTag(jsTags: tsm.JSDocTagInfo[], name: string) {
  return jsTags.some((n) => n.getName() === name)
}

function parseApiInfo(jsTags: tsm.JSDocTagInfo[]) {
  const apiInfo: Record<string, string> = {}
  const apiTag = jsTags.find((n) => n.getName() === 'api')

  // biome-ignore lint/complexity/noForEach: <explanation>
  apiTag?.getText().forEach((apiProperty) => {
    const result = ApiTagExtractRegexp.exec(apiProperty.text)?.groups

    if (result) {
      apiInfo[result.name] = result.value
    }
  })

  return apiInfo
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
  /**
   * Routes directory
   */
  routesRoot: string
  /**
   * Glob pattern
   */
  matchFiles: string[]
  /**
   * Extract route info
   */
  routeInfoExtractor?: RouteInfoExtractor
}
