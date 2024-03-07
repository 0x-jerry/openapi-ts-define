import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

export function toBooleanSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'boolean'
  }

  if (node.isBooleanLiteral()) {
    schema.const = node.getLiteralValue() as any
  }

  return schema
}
