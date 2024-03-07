import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'

import { toObjectSchema } from './object'
import { toStringSchema } from './string'
import { toNumberSchema } from './number'
import { toBooleanSchema } from './boolean'
import { toUnionSchema } from './union'
import type { ToSchemaContext } from './types'


export function toSchema(node: tsm.Node | tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  if (tsm.Node.isNode(node)) {

    ctx.nodeStack.push(node)

    const type = node.getType()
    const schema = _toSchema(type, ctx)

    ctx.nodeStack.pop()

    return schema
  }

  return _toSchema(node, ctx)
}

function _toSchema(type: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  if (type.isBoolean() || type.isBooleanLiteral()) {
    return toBooleanSchema(type)
  } else if (type.isUnion()) {
    return toUnionSchema(type, ctx)
  } else if (type.isObject() || type.isEnum()) {
    return toObjectSchema(type, ctx)
  } else if (type.isString() || type.isStringLiteral()) {
    return toStringSchema(type)
  } else if (type.isNumber() || type.isNumberLiteral()) {
    return toNumberSchema(type)
  }


  const shcmea: JSONSchema7 = {}
  return shcmea
}
