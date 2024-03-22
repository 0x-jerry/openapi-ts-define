import { OpenAPIGenerator, RoutesParser } from '@/index'
import path from 'path'

describe('test generate openapi schema', () => {
  it('should generate oepnapi schema file', async () => {
    const parser = new RoutesParser({
      tsconfig: 'tsconfig.json',
    })

    parser.parse({
      root: path.resolve('example/routes'),
      files: ['**/*.ts', '!**/_*.ts'],
    })

    const output = {
      refs: parser.schemaContext.refs.data,
      routes: parser.routes,
    }

    expect(output).toMatchFileSnapshot('openapi.schema.txt')

    const generator = OpenAPIGenerator({
      openAPI: {
        info: {
          version: '1.0.0',
          title: 'test spec',
        },
      },
    })

    const schema = generator(output.routes, output.refs)

    expect(JSON.stringify(schema, null, 2)).toMatchFileSnapshot('openapi.schema.json')
  })
})
