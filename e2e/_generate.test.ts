import { OpenAPIGenerator, RoutesParser } from '../src'
import path from 'path'

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

    expect(output).toMatchFileSnapshot('openapi.schema.txt')

    const schema = generator.generate(output.routes, output.refs)

    expect(JSON.stringify(schema, null, 2)).toMatchFileSnapshot('openapi.schema.json')
  })
})
