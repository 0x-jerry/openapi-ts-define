import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import { toSchema } from './schema'
import { getDocument } from './utils'
import type { ToSchemaContext } from './types'

export function toObjectSchema(
  type: tsm.Type,
  ctx: ToSchemaContext
): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'object',
  }

  const propertiesSchema: Record<string, JSONSchema7> = {}

  const description = getDocument(type)
  if (description) schema.description = description

  const props = type.getProperties()

  const requiredProps: string[] = []

  for (const prop of props) {
    const propName = prop.getName()

    const result = generatePropSchema(prop, ctx)
    if (!result) continue

    propertiesSchema[propName] = result.schema
    if (result.required) requiredProps.push(propName)
  }

  if (requiredProps.length) {
    schema.required = requiredProps
  }

  if (Object.keys(propertiesSchema).length) {
    schema.properties = propertiesSchema
  }

  return schema
}

function generatePropSchema(prop: tsm.Symbol, ctx: ToSchemaContext): { schema: JSONSchema7, required: boolean } | false {
  const currentNode = ctx.nodeStack.at(-1)!
  const isOptional = prop.isOptional()

  let propType = prop.getTypeAtLocation(currentNode)

  // unwrap optional type
  if (propType.isUnion() && isOptional) {
    propType = propType.getNonNullableType()
  }

  // skip methods
  if (propType.getCallSignatures().length) {
    return false
  }

  const propSchema = toSchema(propType, ctx)

  const description = getDocument(prop)
  if (description) {
    propSchema.description = description
  }

  return {
    schema: propSchema,
    required: !isOptional
  }
}
