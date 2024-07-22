import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import { getDocument } from './utils'
import { toSchema } from './schema'
import type { ToSchemaContext } from './types'

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
