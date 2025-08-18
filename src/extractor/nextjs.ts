import path from 'node:path'
import { Node } from 'ts-morph'
import { getDocument } from '../schemas/utils'
import type { RouteRequestParam } from '../types'
import type { RouteInfo, RouteInfoExtractCallback, RouteInfoExtractor } from './types'

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

/**
 *
 * Supported path format:
 *
 * dashboard/[team]/route.js =>	/dashboard/1	Promise<{ team: '1' }>
 * shop/[tag]/[item]/route.js	=> /shop/1/2	Promise<{ tag: '1', item: '2' }>
 * blog/[...slug]/route.js	=> /blog/1/2	Promise<{ slug: ['1', '2'] }> // Not support
 *
 * @param relativeFilePath
 * @private
 * @returns
 */
export function _convertToUrlPath(relativeFilePath: string) {
  const params: RouteRequestParam[] = []

  const parsedPath = path.parse(relativeFilePath)
  // remove path ext
  const relativeFilePathWithoutExt = relativeFilePath.replace(parsedPath.ext, '')

  const urlSegments = relativeFilePathWithoutExt.split('/').map((part, idx, arr) => {
    const isLast = arr.length - 1 === idx

    if (isLast) {
      return ''
    }

    if (isPathParam(part)) {
      const name = part.slice(1, -1)
      const isArray = name.startsWith('...')
      if (isArray) {
        throw new Error(`Not support array params`)
      }
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
  }
}

function isPathParam(pathPart: string) {
  return pathPart[0] === '[' && pathPart[pathPart.length - 1] === ']'
}

const extractRouteInfo: RouteInfoExtractCallback = (source, ctx) => {
  const symbols = source.getExportSymbols().filter((s) => {
    const name = s.getName()

    return methods.includes(name)
  })

  const routes = symbols.map((declareSymbol) => {
    const method = declareSymbol.getName()
    const declaration = declareSymbol.getValueDeclaration()

    if (!Node.isVariableDeclaration(declaration)) {
      return null
    }

    const node = declaration.getInitializer()

    if (!Node.isCallExpression(node)) {
      return null
    }

    const routeInfo = _convertToUrlPath(ctx.path)

    const jsTags = declareSymbol.getJsDocTags()

    const routeConfig: RouteInfo = {
      description: getDocument(declareSymbol),
      path: routeInfo.path,
      method: method.toLowerCase(),
      routeDefineAST: node,
      jsTags,
    }

    return routeConfig
  })

  return routes.filter((n) => n != null)
}

export interface NextjsExtractorOptions {
  /**
   * Routes directory
   */
  root: string
  /**
   * Glob pattern
   */
  files?: string[]
}

export function nextjsExtractor(option: NextjsExtractorOptions) {
  const extractor: RouteInfoExtractor = {
    root: option.root,
    files: option.files ?? ['**/route.ts'],
    extract: extractRouteInfo,
  }

  return extractor
}
