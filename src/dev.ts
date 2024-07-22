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

const exportNodes = source.getExportSymbols().map((item) => item.getDeclarations().at(0)!)

const schemas = exportNodes.map((n) => toSchema(n, ctx))

console.log(JSON.stringify(schemas, null, 2))
