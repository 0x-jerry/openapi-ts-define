import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

import { toObjectSchema } from './object'
import { toStringSchema } from './string'
import { toNumberSchema } from './number'
import { toBooleanSchema } from './boolean'
import { toUnionSchema } from './union'
import { toEnumSchema } from './enum'

export function toSchema(node: tsm.Node): JSONSchema7 {
  node = unwrapNode(node)

  if (Node.isTypeAliasDeclaration(node)) {
    const typeNode = node.getTypeNode()

    if (Node.isTypeLiteral(typeNode)) {
      return toObjectSchema(node)
    } else if (Node.isUnionTypeNode(typeNode)) {
      return toUnionSchema(typeNode)
    }
  } else if (Node.isTypeLiteral(node)) {
    return toObjectSchema(node)
  } else if (Node.isInterfaceDeclaration(node)) {
    return toObjectSchema(node)
  } else if (
    Node.isStringKeyword(node) ||
    Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node)
  ) {
    return toStringSchema(node)
  } else if (Node.isNumericLiteral(node) || Node.isNumberKeyword(node)) {
    return toNumberSchema(node)
  } else if (Node.isBooleanKeyword(node) || Node.isTrueLiteral(node) || Node.isFalseLiteral(node)) {
    return toBooleanSchema(node)
  } else if (Node.isUnionTypeNode(node)) {
    return toUnionSchema(node)
  } else if (Node.isEnumDeclaration(node)) {
    return toEnumSchema(node)
  }

  const shcmea: JSONSchema7 = {}
  return shcmea
}

function unwrapNode(node: tsm.Node): tsm.Node {
  if (Node.isLiteralTypeNode(node)) {
    return node.getLiteral()
  }

  return node
}
