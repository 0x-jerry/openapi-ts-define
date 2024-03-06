import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

import { toObjectSchema } from './object'
import { toStringSchema } from './string'
import { toNumberSchema } from './number'
import { toBooleanSchema } from './boolean'

export function toSchema(node: tsm.Node): JSONSchema7 {
  if (Node.isInterfaceDeclaration(node)) {
    return toObjectSchema(node)
  }

  else if (Node.isTypeAliasDeclaration(node)) {
    const typeNode = node.getTypeNode()

    if (Node.isTypeLiteral(typeNode)) {
      return toObjectSchema(node)
    }
  }

  else if (Node.isStringKeyword(node) || Node.isStringLiteral(node)) {
    return toStringSchema(node)
  }

  else if (Node.isNumericLiteral(node) || Node.isNumberKeyword(node)) {
    return toNumberSchema(node)
  }

  else if (Node.isBooleanKeyword(node) || Node.isTrueLiteral(node) || Node.isFalseLiteral(node)) {
    return toBooleanSchema(node)
  }

  const shcmea: JSONSchema7 = {}
  return shcmea
}
