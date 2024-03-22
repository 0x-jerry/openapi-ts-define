import path from 'path'
import type { RouteRequestParam } from '../types'
import type { RouteInfoExtractor, RouteInfo } from './types'
import tsm, { Node } from 'ts-morph'

const methodRE = /\.(?<method>get|post|put|delete)$/i

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
  let method = 'get'

  const params: RouteRequestParam[] = []

  const parsedPath = path.parse(relativeFilePath)
  // remove path ext
  relativeFilePath = relativeFilePath.replace(parsedPath.ext, '')

  const urlSegments = relativeFilePath.split('/').map((part, idx, arr) => {
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

      return `:${name}`
    } else {
      return part
    }
  })

  const urlPath = '/' + urlSegments.join('/')

  return {
    path: urlPath,
    params,
    method,
  }
}

function isPathParam(pathPart: string) {
  return pathPart[0] === '[' && pathPart[pathPart.length - 1] === ']'
}

const nitroExtractor: RouteInfoExtractor = (source, ctx) => {
  const exportSymbol = source.getDefaultExportSymbol()

  if (!exportSymbol) {
    return
  }

  const node = getRouteDefineNode(exportSymbol)

  if (!Node.isCallExpression(node)) {
    return
  }

  const routeInfo = convertToUrlPath(ctx.path)

  const routeConfig: RouteInfo = {
    path: routeInfo.path,
    method: routeInfo.method,
    routeDefineAST: node,
  }

  return routeConfig

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
        return node.getInitializer()
      }
    }
  }
}

export default nitroExtractor
