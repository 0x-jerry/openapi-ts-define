import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'
import { getJsDoc } from './utils'

type EnumValue = string | number | boolean | null

export function toEnumSchema(node: tsm.EnumDeclaration): JSONSchema7 {
  const schema: JSONSchema7 = {}

  const description = getJsDoc(node)
  if (description) {
    schema.description = description
  }

  const members = node.getMembers()

  if (members) {
    let preValue: number = -1

    const values: EnumValue[] = []

    for (const member of members) {
      const initializer = member.getInitializer()

      let value: EnumValue = null

      if (initializer) {
        if (isLiteralLike(initializer)) {
          value = initializer.getLiteralValue()
        } else if (Node.isNullLiteral(initializer)) {
          value = null
        } else {
          console.warn('un-support enum value:', member.getText())
        }
      } else {
        value = preValue + 1
      }

      values.push(value)

      if (typeof value === 'number') {
        preValue = value
      }
    }

    schema.enum = values
  }

  return schema
}

type LiteralTypeNode =
  | tsm.StringLiteralLike
  | tsm.NumericLiteral
  | tsm.TrueLiteral
  | tsm.FalseLiteral

function isLiteralLike(node: tsm.Node): node is LiteralTypeNode {
  return (
    Node.isNumericLiteral(node) ||
    Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node) ||
    Node.isFalseLiteral(node) ||
    Node.isTrueLiteral(node)
  )
}
