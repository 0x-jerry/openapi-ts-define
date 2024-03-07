import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import { toSchema } from './schema'
import type { ToSchemaContext } from './types'

export function toUnionSchema(node: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {}

  const types = node.getUnionTypes()

  if (!types.length) {
    return schema
  }

  schema.oneOf = types.map((item) => {
    const node = item.getSymbol()?.getDeclarations().at(0)

    if (node) {
      const itemSchema = toSchema(node, ctx)
      return itemSchema
    }

    return {}
  })

  return schema
}
