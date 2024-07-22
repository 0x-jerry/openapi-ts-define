import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'
import type { ToSchemaContext } from './types'
import { toSchema } from './schema'
import path from 'path'

/**
 *
 * @param type maybe interface declaration, type literal, enum declaration
 * @param ctx
 * @returns
 */
export function toRefSchema(type: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {
    $ref: '',
  }

  const sy = type.getAliasSymbol() || type.getSymbol()
  const node = sy?.getDeclarations().at(0)

  const supportedType =
    Node.isEnumDeclaration(node) ||
    Node.isInterfaceDeclaration(node) ||
    Node.isTypeLiteral(node) ||
    Node.isTypeAliasDeclaration(node)

  if (!supportedType) {
    return toSchema(type, ctx, { skipRefCheck: true })
  }

  const name = getNodeName(node)

  if (!name) {
    return toSchema(type, ctx, { skipRefCheck: true })
  }

  const sf = node.getSourceFile()

  const relativePath = path.relative(ctx.cwd, sf.getFilePath()).replaceAll(path.sep, '/')
  const refKey = ctx.refs.getRefKey(relativePath, name)

  schema.$ref = refKey

  if (!ctx.refs.has(relativePath, name)) {
    const schema = toSchema(node, ctx, { skipRefCheck: true })
    ctx.refs.set(relativePath, name, schema)
  }

  return schema
}

function getNodeName(
  node:
    | tsm.InterfaceDeclaration
    | tsm.TypeLiteralNode
    | tsm.EnumDeclaration
    | tsm.TypeAliasDeclaration
) {
  if (Node.isTypeLiteral(node)) {
    const parentNode = node.getParent()
    if (Node.isTypeAliasDeclaration(parentNode)) {
      const name = parentNode.getName()

      return name
    }
    return false
  }

  return node.getName()
}
