import path from 'node:path'
import type tsm from 'ts-morph'
import { Node } from 'ts-morph'
import { getDocument } from '../schemas/utils'
import type { RouteRequestParam } from '../types'
import type { RouteInfo, RouteInfoExtractor } from './types'

const methodRE = /\.(?<method>get|post|put|delete|patch)$/i

/**
 *
 * Supported path format:
 *
 * - api/index.ts => GET /api => /api
 * - api/hello.ts => GET /api/hello => /api/hello
 * - api/hello.get.ts => GET /api/hello => /api/hello
 * - api/hello.post.ts => POST /api/hello => /api/hello
 * - api/user/[id].get.ts => GET /api/user/:id => /api/user/{id}
 * - api/user/[id].post.ts => POST /api/user/:id => /api/user/{id}
 * - api/user/[id]/[name].put.ts => PUT /api/user/:id/:name => /api/user/{id}/{name}
 *
 * @param relativeFilePath
 * @private
 * @returns
 */
export function _convertToUrlPath(relativeFilePath: string) {
  let method = 'get'

  const params: RouteRequestParam[] = []

  const parsedPath = path.parse(relativeFilePath)
  // remove path ext
  const relativeFilePathWithoutExt = relativeFilePath.replace(parsedPath.ext, '')

  const urlSegments = relativeFilePathWithoutExt.split('/').map((_part, idx, arr) => {
    let part = _part
    const isLast = arr.length - 1 === idx

    if (isLast) {
      const match = methodRE.exec(part)
      if (match) {
        method = match.groups!.method.toLowerCase() || 'get'
        part = part.replace(methodRE, '')
      }
    }

    if (isPathParam(part)) {
      const name = part.slice(1, -1)
      params.push({
        name,
      })

      return `{${name}}`
    }
    return part
  })

  if (urlSegments.at(-1) === 'index') {
    urlSegments.splice(urlSegments.length - 1, 1)
  }

  const urlPath = `/${urlSegments.join('/')}`

  return {
    path: urlPath,
    params,
    method,
  }
}

function isPathParam(pathPart: string) {
  return pathPart[0] === '[' && pathPart[pathPart.length - 1] === ']'
}

const ApiTagExtractRegexp = /^\.(?<name>[\w\d]+)\s+(?<value>.+)$/

const nitroExtractor: RouteInfoExtractor = (source, ctx) => {
  const exportSymbol = source.getDefaultExportSymbol()

  if (!exportSymbol) {
    return
  }

  const node = getRouteDefineNode(exportSymbol)

  if (!Node.isCallExpression(node)) {
    return
  }

  const routeInfo = _convertToUrlPath(ctx.path)

  const extraInfo: Record<string, string> = {}

  const apiTag = exportSymbol.getJsDocTags().find((n) => n.getName() === 'api')

  // biome-ignore lint/complexity/noForEach: <explanation>
  apiTag?.getText().forEach((apiProperty) => {
    const result = ApiTagExtractRegexp.exec(apiProperty.text)?.groups

    if (result) {
      extraInfo[result.name] = result.value
    }
  })

  const routeConfig: RouteInfo = {
    description: getDocument(exportSymbol),
    path: routeInfo.path,
    method: routeInfo.method,
    routeDefineAST: node,
    extra: extraInfo,
  }

  return routeConfig
}

function getRouteDefineNode(exportSymbol: tsm.Symbol) {
  const exportAssignment = exportSymbol.getDeclarations().at(0)

  if (!Node.isExportAssignment(exportAssignment)) {
    return
  }

  const initializer = exportAssignment.getExpression()

  /**
   * export default defRoute(() => ...)
   */
  if (Node.isCallExpression(initializer)) {
    return initializer
  }

  /**
   * const handler = defRoute(() => ...)
   *
   * export default handler
   */
  if (Node.isIdentifier(initializer)) {
    const node = initializer.getDefinitionNodes().at(0)
    if (Node.isVariableDeclaration(node)) {
      const initializer = node.getInitializer()
      if (Node.isCallExpression(initializer)) {
        return initializer
      }
    }
  }
}

export default nitroExtractor
