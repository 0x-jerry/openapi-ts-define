import type { JSONSchema7 } from 'json-schema'
import type tsm from 'ts-morph'
import type { ToSchemaContext } from './types'

import { toEnumSchema } from '.'
import { toArraySchema } from './array'
import { toBooleanSchema } from './boolean'
import { toNumberSchema } from './number'
import { toObjectSchema } from './object'
import { toRefSchema } from './ref'
import { toStringSchema } from './string'
import { toUnionSchema } from './union'

export interface ToSchemaOption {
  skipRefCheck?: boolean
}

export function toSchema(
  typeNode: tsm.Type,
  ctx: ToSchemaContext,
  option?: ToSchemaOption,
): JSONSchema7 {
  if (!option?.skipRefCheck) {
    return toRefSchema(typeNode, ctx)
  }

  return _toSchema(typeNode, ctx)
}

function _toSchema(type: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  if (type.isArray()) {
    return toArraySchema(type, ctx)
  }
  if (type.isEnum()) {
    return toEnumSchema(type)
  }
  if (type.isBoolean() || type.isBooleanLiteral()) {
    return toBooleanSchema(type)
  }
  if (type.isUnion()) {
    return toUnionSchema(type, ctx)
  }
  if (type.isObject()) {
    return toObjectSchema(type, ctx)
  }
  if (type.isString() || type.isStringLiteral()) {
    return toStringSchema(type)
  }
  if (type.isNumber() || type.isNumberLiteral()) {
    return toNumberSchema(type)
  }

  const schema: JSONSchema7 = {}
  return schema
}
