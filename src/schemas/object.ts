import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'
import { toSchema } from './schema'
import { getJsDoc } from './utils'
import type { ToSchemaContext } from './types'

export function toObjectSchema(
  node: tsm.TypeAliasDeclaration | tsm.InterfaceDeclaration | tsm.TypeLiteralNode,
  ctx: ToSchemaContext
): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: 'object',
  }

  if (!Node.isTypeLiteral(node)) {
    const description = getJsDoc(node)
    if (description) {
      schema.description = description
    }
  }

  const properties: tsm.PropertySignature[] = []

  const propertiesContainerNode = Node.isTypeAliasDeclaration(node)
    ? node.getTypeNode()?.asKind(tsm.ts.SyntaxKind.TypeLiteral)
    : node

  propertiesContainerNode?.getMembers().forEach((prop) => {
    if (Node.isPropertySignature(prop)) {
      properties.push(prop)
    }
  })

  if (properties.length) {
    const propertiesSchema: Record<string, JSONSchema7> = {}

    const required: string[] = []

    for (const property of properties) {
      const name = property.getName()

      const node = property.getTypeNode()

      const propertySchema: JSONSchema7 = node ? toSchema(node, ctx) : { type: 'string' }

      const description = getJsDoc(property)
      if (description) {
        propertySchema.description = description
      }

      propertiesSchema[name] = propertySchema

      if (!property.hasQuestionToken()) {
        required.push(name)
      }
    }

    schema.properties = propertiesSchema

    if (required.length) {
      schema.required = required
    }
  }

  return schema
}
