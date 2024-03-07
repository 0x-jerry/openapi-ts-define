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

    const propType = prop.getTypeAtLocation(rootNode)
    const propSchema = toSchema(propType, ctx)

    if (!prop.isOptional()) {
      required.push(propName)
    }

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
