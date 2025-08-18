import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { OpenAPIGenerator, RoutesParser } from '..'
import { nextjsExtractor } from './nextjs'

describe('parse typescript definition', async () => {
  const featureDirs = await readdir(path.join(__dirname, 'tests/nextjs'))

  for (const featureDir of featureDirs) {
    it(`#nextjs.${featureDir}`, async () => {
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

      const extractor = nextjsExtractor({
        root: path.join(__dirname, `tests/nextjs/${featureDir}`),
      })

      parser.parse(extractor)

      const output = {
        refs: parser.schemaContext.refs.data,
        routes: parser.routes,
      }

      await expect(output).toMatchFileSnapshot(`out/tests/nextjs/${featureDir}/output.txt`)

      const schema = generator.generate(output.routes, output.refs)

      await expect(JSON.stringify(schema, null, 2)).toMatchFileSnapshot(
        `out/tests/nextjs/${featureDir}/schema.json`,
      )
    })
  }
})
