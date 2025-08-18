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
  routeDefineAST: tsm.CallExpression
  jsTags: tsm.JSDocTagInfo[]
}

export type RouteInfoExtractCallback = (
  source: tsm.SourceFile,
  ctx: RouteInfoExtractorContext,
) => Arrayable<RouteInfo> | undefined

export interface RouteInfoExtractor  {
  root: string
  files: string[]

  extract: RouteInfoExtractCallback
}