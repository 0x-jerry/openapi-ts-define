import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

export function toStringSchema(node: tsm.StringLiteral | tsm.NoSubstitutionTemplateLiteral | tsm.Expression): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'string',
  }

  if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
    schema.const = node.getLiteralValue()
  }

  return schema
}
