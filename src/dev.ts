import path from 'node:path'
import { OpenAPIGenerator } from '.'
import { RoutesParser } from './RoutesParser'
import { nitroExtractor } from './extractor/nitro'

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
  root: path.resolve('tests/features/docs'),
  files: ['**/*.ts', '!**/_*.ts'],
})

parser.parse(extractor)

const output = {
  refs: parser.schemaContext.refs.data,
  routes: parser.routes,
}

console.log(JSON.stringify(output, null, 2))
