import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import { toSchema } from './schema'

export function toUnionSchema(node: tsm.UnionTypeNode): JSONSchema7 {
  const schema: JSONSchema7 = {}

  const types = node.getTypeNodes()

  if (!types.length) {
    return schema
  }

  schema.oneOf = types.map((item) => toSchema(item))

  return schema
}
