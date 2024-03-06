import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

export function toBooleanSchema(node: tsm.BooleanLiteral | tsm.Expression): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'boolean'
  }

  if (Node.isTrueLiteral(node)) {
    schema.const = true
  }

  else if (Node.isFalseLiteral(node)) {
    schema.const = false
  }

  return schema
}
