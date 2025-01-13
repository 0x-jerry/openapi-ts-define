import type { JSONSchema7 } from 'json-schema'
import type { ReferenceManager } from 'src/schemas/types'
import type { RouteConfig } from '../types'

export interface SchemaGeneratorContext<T> {
  refsManager?: ReferenceManager
  generate: SchemaGenerator<T>
}

export type SchemaGenerator<T> = (routes: RouteConfig[], refs: Map<string, JSONSchema7>) => T
