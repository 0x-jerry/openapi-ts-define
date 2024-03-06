import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

import { toObjectSchema } from './object'

export function toSchema(node: tsm.Node): JSONSchema7 {
  if (Node.isInterfaceDeclaration(node)) {
    return toObjectSchema(node)
  }

  if (Node.isTypeAliasDeclaration(node)) {
    const typeNode = node.getTypeNode()

    if (Node.isTypeLiteral(typeNode)) {
      return toObjectSchema(node)
    }
  }

  const shcmea: JSONSchema7 = {}
  return shcmea
}
