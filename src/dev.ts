import path from 'path'
import { Project, Node } from 'ts-morph'
import type { ToSchemaContext } from './schemas/types'
import { RefsManager } from './schemas/utils'
import { toSchema } from './schemas/schema'

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
})

const cwd = path.join(import.meta.dirname, 'schemas/examples')

const ctx: ToSchemaContext = {
  cwd,
  project,
  refs: new RefsManager(),
  nodeStack: [],
}

const absFile = path.join(cwd, 'generic.ts')

const source = project.getSourceFileOrThrow(absFile)

const types = source
  .getStatements()
  .filter(
    (node) =>
      Node.isInterfaceDeclaration(node) ||
      Node.isTypeAliasDeclaration(node) ||
      Node.isEnumDeclaration(node)
  )

const schemas = types.map((n) => toSchema(n, ctx))

console.log(JSON.stringify(schemas, null, 2))
