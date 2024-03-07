import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import { toSchema } from './schema'
import type { ToSchemaContext } from './types'

export function toUnionSchema(node: tsm.UnionTypeNode, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {}

  const types = node.getTypeNodes()

  if (!types.length) {
    return schema
  }

  schema.oneOf = types.map((item) => toSchema(item, ctx))

  return schema
}
