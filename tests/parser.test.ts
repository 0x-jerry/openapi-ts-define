import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { OpenAPIGenerator, RoutesParser } from '../src'

describe('parse typescript definition', async () => {
  const featureDirs = await readdir('tests/features')

  for (const featureDir of featureDirs) {
    it(`#feature.${featureDir}`, async () => {
      const generator = OpenAPIGenerator({
        openAPI: {
          info: {
            version: '1.0.0',
            title: 'test spec',
          },
        },
      })

      const parser = new RoutesParser({
        tsconfig: 'tsconfig.json',
        refsManager: generator.refsManager!,
      })

      parser.parse({
        routesRoot: path.resolve(`tests/features/${featureDir}`),
        matchFiles: ['**/*.ts', '!**/_*.ts'],
      })

      const output = {
        refs: parser.schemaContext.refs.data,
        routes: parser.routes,
      }

      await expect(output).toMatchFileSnapshot(`out/${featureDir}/output.txt`)

      const schema = generator.generate(output.routes, output.refs)

      await expect(JSON.stringify(schema, null, 2)).toMatchFileSnapshot(
        `out/${featureDir}/schema.json`,
      )
    })
  }
})
