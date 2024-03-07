import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

type EnumValue = string | number | boolean | null

export function toEnumSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {}


  return schema
}
