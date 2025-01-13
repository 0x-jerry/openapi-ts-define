import type { JSONSchema7 } from 'json-schema'
import type tsm from 'ts-morph'
import { ts } from 'ts-morph'
import { getDocument } from './utils'

export function toStringSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'string',
  }

  const doc = getDocument(node)
  if (doc) {
    schema.description = doc
  }

  if (node.isStringLiteral()) {
    schema.enum = [node.getLiteralValue() as string]
  }

  return schema
}
