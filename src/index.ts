import path from 'path'
import { RoutesParser } from './RoutesParser'

const parser = new RoutesParser({
  tsconfig: 'tsconfig.json',
})

parser.parse({
  root: path.resolve('example/routes'),
  files: ['**/*.ts'],
})
