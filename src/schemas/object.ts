import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'
import { toSchema } from './schema'
import { getJsDoc } from './utils'
import type { ToSchemaContext } from './types'

export function toObjectSchema(
  type: tsm.Type,
  ctx: ToSchemaContext
): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'object',
  }

  const propertiesSchema: Record<string, JSONSchema7> = {}

  const rootNode = ctx.nodeStack.at(0)!
  const currentNode = ctx.nodeStack.at(-1)!

  if (Node.isInterfaceDeclaration(currentNode) || Node.isTypeAliasDeclaration(currentNode)) {
    const description = getJsDoc(currentNode)

    if (description) schema.description = description
  }

  const props = type.getProperties()

  const required: string[] = []

  for (const prop of props) {
    const propName = prop.getName()
    const propNode = prop.getValueDeclaration()
    const isOptional = prop.isOptional()

    let propType = prop.getTypeAtLocation(rootNode)


    if (propType.isUnion() && isOptional) {
      const types = propType.getUnionTypes().filter(n => !n.isUndefined())
      if (types.length === 1) {
        propType = types[0]
      }
    }

    // skip methods
    if (propType.getCallSignatures().length) {
      continue
    }

    if (!isOptional) {
      required.push(propName)
    }

    const propSchema = toSchema(propType, ctx)

    if (propNode && (Node.isPropertySignature(propNode)) || Node.isEnumMember(propNode)) {
      const description = getJsDoc(propNode)
      if (description) {
        propSchema.description = description
      }
    }

    propertiesSchema[propName] = propSchema
  }

  if (required.length) {
    schema.required = required
  }

  if (Object.keys(propertiesSchema).length) {
    schema.properties = propertiesSchema
  }

  return schema
}
