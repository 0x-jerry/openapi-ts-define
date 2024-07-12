import type { JSONSchema7 } from 'json-schema'
import type { RouteConfig } from '../types'
import type { ReferenceManager } from 'src/schemas/types'

export interface SchemaGeneratorContext<T> {
  refsManager?: ReferenceManager
  generate: SchemaGenerator<T>
}

export interface SchemaGenerator<T> {
  (routes: RouteConfig[], refs: Map<string, JSONSchema7>): T
}
