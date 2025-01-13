import type { JSONSchema7 } from 'json-schema'
import type tsm from 'ts-morph'
import { ts } from 'ts-morph'
import { getDocument } from './utils'

export function toNumberSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'number',
  }

  const doc = getDocument(node)
  if (doc) {
    schema.description = doc
  }

  if (node.isNumberLiteral()) {
    schema.enum = [node.getLiteralValue() as number]
  }

  return schema
}
