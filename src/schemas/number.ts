import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

export function toNumberSchema(node: tsm.NumericLiteral | tsm.Expression): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'number'
  }

  if (Node.isNumericLiteral(node)) {
    schema.const = node.getLiteralValue()
  }

  return schema
}
