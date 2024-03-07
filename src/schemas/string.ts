import type { JSONSchema7 } from 'json-schema'
import tsm, { ts } from 'ts-morph'

export function toStringSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'string',
  }

  if (node.isStringLiteral()) {
    schema.const = node.getLiteralValue() as string
  }

  return schema
}
