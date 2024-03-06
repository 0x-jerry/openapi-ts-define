import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

export function toNumberSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'string'
  }

  return schema
}
