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

  const node = (type.getAliasSymbol() || type.getSymbol())?.getDeclarations().at(0)

  if (!node) {
    return _getSchema()
  }

  const supportedType =
    Node.isEnumDeclaration(node) ||
    Node.isInterfaceDeclaration(node) ||
    Node.isTypeLiteral(node) ||
    Node.isTypeAliasDeclaration(node)

  if (!supportedType) {
    return _getSchema()
  }

  const typeName = getNodeName(type, node)

  if (!typeName) {
    return _getSchema()
  }

  const sf = node.getSourceFile()

  const relativePath = path.relative(ctx.cwd, sf.getFilePath()).replaceAll(path.sep, '/')
  const refKey = ctx.refs.getRefKey(relativePath, typeName)

  schema.$ref = refKey

  if (!ctx.refs.has(relativePath, typeName)) {
    const schema = _getSchema()
    ctx.refs.set(relativePath, typeName, schema)
  }

  return schema

  function _getSchema() {
    return toSchema(type, ctx, { skipRefCheck: true })
  }
}

function getNodeName(
  type: tsm.Type,
  node:
    | tsm.InterfaceDeclaration
    | tsm.TypeLiteralNode
    | tsm.EnumDeclaration
    | tsm.TypeAliasDeclaration
) {
  // todo, get correct name
  if (Node.isTypeLiteral(node)) {
    const parentNode = node.getParent()
    if (Node.isTypeAliasDeclaration(parentNode)) {
      const name = parentNode.getName()

      return name
    }
    return false
  }

  if (type.isArray()) {
    // hack, skip raw Array<T> type
    if (node.getSourceFile().getFilePath().includes('node_modules')) {
      return
    }
  }

  return node.getName()
}
