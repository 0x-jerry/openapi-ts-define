import path from 'node:path'
import { OpenAPIGenerator, RoutesParser } from '../src'

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

    parser.parse({
      routesRoot: path.resolve('e2e/routes'),
      matchFiles: ['**/*.ts', '!**/_*.ts'],
    })

    const output = {
      refs: parser.schemaContext.refs.data,
      routes: parser.routes,
    }

    await expect(output).toMatchFileSnapshot('openapi.schema.txt')

    const schema = generator.generate(output.routes, output.refs)

    await expect(JSON.stringify(schema, null, 2)).toMatchFileSnapshot('openapi.schema.json')
  })
})
