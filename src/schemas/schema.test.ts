import path from 'path'
import { Node, Project } from 'ts-morph'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import { toSchema } from './schema'
import type { ToSchemaContext } from './types'
import { RefsManager } from './utils'

describe('object schema', () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const cwd = path.join(__dirname, 'examples')

  const project = new Project({
    tsConfigFilePath: path.join(cwd, 'tsconfig.json'),
  })

  const files = fg.sync('*.ts', { cwd })

  for (const file of files) {
    it(`should convert to schema: ${file}`, async () => {
      const ctx: ToSchemaContext = {
        cwd,
        project,
        refs: new RefsManager(),
        nodeStack: [],
      }

      const absFile = path.join(cwd, file)

      const source = project.getSourceFileOrThrow(absFile)

      const types = source
        .getStatements()
        .filter(
          (node) =>
            Node.isInterfaceDeclaration(node) ||
            Node.isTypeAliasDeclaration(node) ||
            Node.isEnumDeclaration(node)
        )

      const outputFile = path.join(cwd, file.replace('.ts', '.output.txt'))

      const schemas = types.map((n) => toSchema(n, ctx))

      const output = {
        schemas,
        refs: ctx.refs.data,
      }

      expect(output).toMatchFileSnapshot(outputFile)
    })
  }
})
