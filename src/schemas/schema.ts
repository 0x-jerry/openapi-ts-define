import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'
import type { ToSchemaContext } from './types'

import { toObjectSchema } from './object'
import { toStringSchema } from './string'
import { toNumberSchema } from './number'
import { toBooleanSchema } from './boolean'
import { toUnionSchema } from './union'
import { toRefSchema } from './ref'
import { toEnumSchema } from '.'
import { toArraySchema } from './array'

export interface ToSchemaOption {
  skipRefCheck?: boolean
}

export function toSchema(
  node: tsm.Node | tsm.Type,
  ctx: ToSchemaContext,
  option?: ToSchemaOption
): JSONSchema7 {
  if (tsm.Node.isNode(node)) {
    ctx.nodeStack.push(node)

    const type = node.getType()
    const schema = _toSchema(type, ctx, option)

    ctx.nodeStack.pop()

    return schema
  }

  return _toSchema(node, ctx, option)
}

function _toSchema(type: tsm.Type, ctx: ToSchemaContext, option?: ToSchemaOption): JSONSchema7 {
  if (type.isArray()) {
    return toArraySchema(type, ctx)
  } else if (type.isEnum()) {
    if (option?.skipRefCheck) {
      return toEnumSchema(type)
    }

    return toRefSchema(type, ctx)
  } else if (type.isBoolean() || type.isBooleanLiteral()) {
    return toBooleanSchema(type)
  } else if (type.isUnion()) {
    return toUnionSchema(type, ctx)
  } else if (type.isObject()) {
    if (!option?.skipRefCheck && isRefType(type, ctx)) {
      return toRefSchema(type, ctx)
    }

    return toObjectSchema(type, ctx)
  } else if (type.isString() || type.isStringLiteral()) {
    return toStringSchema(type)
  } else if (type.isNumber() || type.isNumberLiteral()) {
    return toNumberSchema(type)
  }

  const schema: JSONSchema7 = {}
  return schema
}

function isRefType(type: tsm.Type, ctx: ToSchemaContext) {
  const node = (type.getAliasSymbol() || type.getSymbol())?.getDeclarations().at(0)
  if (Node.isInterfaceDeclaration(node)) {
    return node.getType().getTypeArguments().length === 0
  }

  if (Node.isTypeReference(node)) {
    return node.getType().getTypeArguments().length === 0
  }

  if (Node.isTypeAliasDeclaration(node)) {
    return node.getType().getTypeArguments().length === 0
  }

  return false
}
