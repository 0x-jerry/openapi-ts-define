import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'

import { toObjectSchema } from './object'
import { toStringSchema } from './string'
import { toNumberSchema } from './number'
import { toBooleanSchema } from './boolean'
import { toUnionSchema } from './union'
import { toEnumSchema } from './enum'
import { toRefSchema } from './ref'
import type { ToSchemaContext } from './types'


export function toSchema(node: tsm.Node, ctx: ToSchemaContext): JSONSchema7 {
  node = unwrapNode(node)

  if (Node.isTypeAliasDeclaration(node)) {
    const typeNode = node.getTypeNode()

    if (Node.isTypeLiteral(typeNode)) {
      return toObjectSchema(node, ctx)
    } else if (Node.isUnionTypeNode(typeNode)) {
      return toUnionSchema(typeNode, ctx)
    }
  } else if (Node.isTypeLiteral(node)) {
    return toObjectSchema(node, ctx)
  } else if (Node.isInterfaceDeclaration(node)) {
    return toObjectSchema(node, ctx)
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
    return toUnionSchema(node, ctx)
  } else if (Node.isEnumDeclaration(node)) {
    return toEnumSchema(node)
  } else if (Node.isTypeReference(node)) {
    return toRefSchema(node, ctx)
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
