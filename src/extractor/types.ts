import type tsm from 'ts-morph'
import type { Arrayable } from '@0x-jerry/utils'

export interface RouteInfoExtractorContext {
  path: string
  project: tsm.Project
}

export interface RouteInfo {
  path: string
  method: string
  routeDefineAST: tsm.CallExpression
}

export interface RouteInfoExtractor {
  (source: tsm.SourceFile, ctx: RouteInfoExtractorContext): Arrayable<RouteInfo> | undefined
}
