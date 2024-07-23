import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
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
  typeNode: tsm.Type,
  ctx: ToSchemaContext,
  option?: ToSchemaOption
): JSONSchema7 {
  if (!option?.skipRefCheck) {
    return toRefSchema(typeNode, ctx)
  }

  return _toSchema(typeNode, ctx)
}

function _toSchema(type: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  if (type.isArray()) {
    return toArraySchema(type, ctx)
  } else if (type.isEnum()) {
    return toEnumSchema(type)
  } else if (type.isBoolean() || type.isBooleanLiteral()) {
    return toBooleanSchema(type)
  } else if (type.isUnion()) {
    return toUnionSchema(type, ctx)
  } else if (type.isObject()) {
    return toObjectSchema(type, ctx)
  } else if (type.isString() || type.isStringLiteral()) {
    return toStringSchema(type)
  } else if (type.isNumber() || type.isNumberLiteral()) {
    return toNumberSchema(type)
  }

  const schema: JSONSchema7 = {}
  return schema
}
