import type { Arrayable } from '@0x-jerry/utils'
import type tsm from 'ts-morph'

export interface RouteInfoExtractorContext {
  /**
   * Realtive path
   */
  path: string
  project: tsm.Project
}

export interface RouteInfo {
  path: string
  method: string
  description?: string
  /**
   * Api define node
   */
  routeDefineAST: tsm.CallExpression
  jsTags: tsm.JSDocTagInfo[]
}

export type RouteInfoExtractCallback = (
  source: tsm.SourceFile,
  ctx: RouteInfoExtractorContext,
) => Arrayable<RouteInfo> | undefined

export interface RouteInfoExtractor {
  /**
   * Routes root
   */
  root: string
  /**
   * Match files, glob pattern
   */
  files: string[]

  extract: RouteInfoExtractCallback
}
