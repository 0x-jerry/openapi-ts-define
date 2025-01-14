import path from 'node:path'
import { OpenAPIGenerator } from '.'
import { RoutesParser } from './RoutesParser'

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
  routesRoot: path.resolve('tests/features/docs'),
  matchFiles: ['**/*.ts', '!**/_*.ts'],
})

const output = {
  refs: parser.schemaContext.refs.data,
  routes: parser.routes,
}

console.log(JSON.stringify(output, null, 2))
