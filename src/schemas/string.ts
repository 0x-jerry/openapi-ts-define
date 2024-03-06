import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

export function toStringSchema(node: tsm.TypeAliasDeclaration | tsm.PropertySignature): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'string'
  }

  return schema
}
