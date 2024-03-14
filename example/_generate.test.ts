import { RoutesParser } from "@/index"
import path from "path"

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
      refs: parser.schemaContext.refs,
      rotues: parser.routes
    }
    expect(output).toMatchFileSnapshot('openapi.schema.txt')
  })
})
