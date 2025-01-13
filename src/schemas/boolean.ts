import type { JSONSchema7 } from 'json-schema'
import type tsm from 'ts-morph'
import { getDocument } from './utils'

export function toBooleanSchema(node: tsm.Type): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'boolean',
  }

  const doc = getDocument(node)
  if (doc) {
    schema.description = doc
  }

  if (node.isBooleanLiteral()) {
    schema.enum = [node.getText() === 'true']
  }

  return schema
}
