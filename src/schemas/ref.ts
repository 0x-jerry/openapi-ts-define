import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import type { ToSchemaContext } from './types'
import { toSchema } from './schema'
import path from 'path'
import { existsSync } from 'fs'

export function toRefSchema(node: tsm.TypeReferenceNode, ctx: ToSchemaContext): JSONSchema7 {
  const schema: JSONSchema7 = {
    $ref: ''
  }

  const sourceName = node.getType().getText()
  const name = node.getTypeName().getText()

  // todo, resolve suffix, make sure file path is correct.
  const absFile = sourceName.slice('import("'.length, -('").' + name).length) + '.ts'

  const sf = ctx.project.getSourceFile(absFile) || node.getSourceFile()

  const relativePath = path.relative(ctx.cwd, sf.getFilePath())
  const refKey = `(${relativePath}).${name}`

  // todo, change ref path
  schema.$ref = refKey

  if (!ctx.refs.has(refKey)) {
    const type = sf.getTypeAlias(name) || sf.getInterface(name)
    if (type) {
      ctx.refs.set(refKey, toSchema(type, ctx))
    } else {
      console.warn('can not resolve type', node.getText())
    }
  }


  return schema
}
