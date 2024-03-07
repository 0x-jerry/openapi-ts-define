import type { JSONSchema7 } from 'json-schema'
import type { Node, Project } from 'ts-morph'

export interface ToSchemaContext {
  cwd: string,
  project: Project,
  refs: Map<string, JSONSchema7>
  nodeStack: Node[]
}
