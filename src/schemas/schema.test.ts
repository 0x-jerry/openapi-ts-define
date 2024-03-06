import path from 'path'
import { Project } from 'ts-morph'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import { toSchema } from './schema'

describe('object schema', () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const cwd = path.join(__dirname, 'examples')

  const project = new Project({
    tsConfigFilePath: path.join(cwd, 'tsconfig.json'),
  })

  const files = fg.sync('*.ts', { cwd })

  for (const file of files) {
    it(`should convert to schema: ${file}`, async () => {
      const absFile = path.join(cwd, file)

      const source = project.getSourceFileOrThrow(absFile)

      const types = source.getTypeAliases()
      const interfaces = source.getInterfaces()
      const enums = source.getEnums()

      const jsonFile = path.join(cwd, file.replace('.ts', '.json'))
      const schemas = [...types, ...enums, ...interfaces].map((n) => toSchema(n))

      expect(JSON.stringify(schemas, null, 2)).toMatchFileSnapshot(jsonFile)
    })
  }
})
