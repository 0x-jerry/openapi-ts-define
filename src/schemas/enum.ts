import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

type EnumValue = string | number | boolean | null

export function toEnumSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {}

  const types = node.getUnionTypes()

  const values = types.filter((item) => item.isLiteral()).map((item) => item.getLiteralValue())

  // todo, need to filter big int value
  schema.enum = values as any as EnumValue[]

  return schema
}
