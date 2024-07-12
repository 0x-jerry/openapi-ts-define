import type { OpenAPIGeneratorConfig } from '../generator/openapi'
import { OpenAPIGenerator, RoutesParser } from '..'
import type { ApiRoutesConfig } from '../RoutesParser'

export interface OpenapiPresetOption {
  tsconfig: string
  openapi: OpenAPIGeneratorConfig
  routes: ApiRoutesConfig
}

export function openapiPreset(opt: OpenapiPresetOption) {
  const generator = OpenAPIGenerator(opt.openapi)

  const parser = new RoutesParser({
    tsconfig: opt.tsconfig,
    refsManager: generator.refsManager!,
  })

  parser.parse(opt.routes)

  const routes = parser.routes

  const schema = generator.generate(routes, parser.schemaContext.refs.data)

  return {
    schema,
    routes,
  }
}
