import { OpenAPIGenerator, RoutesParser } from '..'
import type { ApiRoutesConfig } from '../RoutesParser'
import type { OpenAPIGeneratorConfig } from '../generator/openapi'

export interface OpenapiPresetOption extends OpenAPIGeneratorConfig, ApiRoutesConfig {
  /**
   * Path to tsconfig.json, relative path
   */
  tsconfig: string
}

export function openapiPreset(opt: OpenapiPresetOption) {
  const generator = OpenAPIGenerator(opt)

  const parser = new RoutesParser({
    tsconfig: opt.tsconfig,
    refsManager: generator.refsManager!,
  })

  parser.parse(opt)

  const routes = parser.routes

  const schema = generator.generate(routes, parser.schemaContext.refs.data)

  return {
    schema,
    routes,
  }
}
