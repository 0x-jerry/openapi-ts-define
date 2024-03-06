import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

export function toObjectSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'object'
  }

  return schema
}
