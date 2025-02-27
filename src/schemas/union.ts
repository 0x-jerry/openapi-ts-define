import type { JSONSchema7 } from 'json-schema'
import type tsm from 'ts-morph'
import { toSchema } from './schema'
import type { ToSchemaContext } from './types'
import { getDocument } from './utils'

export function toUnionSchema(type: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {}

  const types = type.getUnionTypes()

  const doc = getDocument(type)
  if (doc) {
    schema.description = doc
  }

  if (!types.length) {
    return schema
  }

  schema.oneOf = types.map((item) => {
    return toSchema(item, ctx)
  })

  return schema
}
