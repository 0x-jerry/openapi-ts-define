import type { Arrayable } from '@0x-jerry/utils'
import type tsm from 'ts-morph'

export interface RouteInfoExtractorContext {
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

export type RouteInfoExtractor = (
  source: tsm.SourceFile,
  ctx: RouteInfoExtractorContext,
) => Arrayable<RouteInfo> | undefined
