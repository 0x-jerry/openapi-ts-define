import type { JSONSchema7 } from 'json-schema'
import type { RouteConfig } from '../types'

export interface SchemaGenerator<T> {
  (routes: RouteConfig[], refs: Map<string, JSONSchema7>): T
}
