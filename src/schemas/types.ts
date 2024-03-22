import type { JSONSchema7 } from 'json-schema'
import type { Node, Project } from 'ts-morph'

export interface ToSchemaContext {
  cwd: string
  project: Project
  refs: ReferenceManager<JSONSchema7>
  nodeStack: Node[]
}

export interface ReferenceManager<T> {
  data: Map<string, T>

  has(path: string, typeName: string): boolean
  get(path: string, typeName: string): T | undefined
  set(path: string, typeName: string, data: T): void
  getKey(path: string, typeName: string): string
}
