import type { JSONSchema7 } from 'json-schema'
import tsm, { ts } from 'ts-morph'

export function toNumberSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'number'
  }

  if (node.isNumberLiteral()) {
    schema.const = node.getLiteralValue() as number
  }

  return schema
}
