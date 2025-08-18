import { OpenAPIGenerator, RoutesParser } from '..'
import type { RouteInfoExtractor } from '../extractor/types'
import type { OpenAPIGeneratorConfig } from '../generator/openapi'

export interface OpenapiPresetOption extends OpenAPIGeneratorConfig {
  /**
   * Path to tsconfig.json, relative path
   */
  tsconfig: string

  extractor: RouteInfoExtractor
}

export function openapiPreset(opt: OpenapiPresetOption) {
  const generator = OpenAPIGenerator(opt)

  const parser = new RoutesParser({
    tsconfig: opt.tsconfig,
    refsManager: generator.refsManager!,
  })

  parser.parse(opt.extractor)

  const routes = parser.routes

  const schema = generator.generate(routes, parser.schemaContext.refs.data)

  return {
    schema,
    routes,
  }
}
