import type { JSONSchema7 } from 'json-schema'
import type tsm from 'ts-morph'
import { toSchema } from './schema'
import type { ToSchemaContext } from './types'
import { getDocument } from './utils'

export function toArraySchema(node: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'array',
    items: [],
  }

  const doc = getDocument(node)
  if (doc) {
    schema.description = doc
  }

  const elementType = node.getArrayElementType()
  if (elementType) {
    schema.items = toSchema(elementType, ctx)
  }

  return schema
}
