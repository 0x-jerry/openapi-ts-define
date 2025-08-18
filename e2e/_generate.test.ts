import path from 'node:path'
import { OpenAPIGenerator, RoutesParser } from '../src'
import { nitroExtractor } from '../src/extractor/nitro'

describe('test generate openapi schema', () => {
  it('should generate oepnapi schema file', async () => {
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

    const extractor = nitroExtractor({
      root: path.resolve('e2e/routes'),
      files: ['**/*.ts', '!**/_*.ts'],
    })

    parser.parse(extractor)

    const output = {
      refs: parser.schemaContext.refs.data,
      routes: parser.routes,
    }

    await expect(output).toMatchFileSnapshot('openapi.schema.txt')

    const schema = generator.generate(output.routes, output.refs)

    await expect(JSON.stringify(schema, null, 2)).toMatchFileSnapshot('openapi.schema.json')
  })
})
