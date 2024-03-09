import type { JSONSchema7 } from 'json-schema'
import tsm, { Node } from 'ts-morph'
import type { ToSchemaContext } from './types'
import { toSchema } from './schema'
import path from 'path'

export function toRefSchema(type: tsm.Type, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {
    $ref: '',
  }

  const sy = type.getSymbol() || type.getAliasSymbol()
  const node = sy?.getDeclarations().at(0)

  const supportedType = Node.isInterfaceDeclaration(node) || Node.isTypeLiteral(node)

  if (!supportedType) {
    return toSchema(type, ctx, { skipRefCheck: true })
  }

  const name = getNodeName(node)

  if (!name) {
    return toSchema(type, ctx, { skipRefCheck: true })
  }

  const sf = node.getSourceFile()

  const relativePath = path.relative(ctx.cwd, sf.getFilePath())
  const refKey = `(${relativePath}).${name}`

  // todo, change ref path
  schema.$ref = refKey

  if (!ctx.refs.has(refKey)) {
    const schema = toSchema(type, ctx, { skipRefCheck: true })
    ctx.refs.set(refKey, schema)
  }

  return schema
}

function getNodeName(node: tsm.InterfaceDeclaration | tsm.TypeLiteralNode) {
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
