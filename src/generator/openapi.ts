import type { RouteRequestParam } from '..'
import type { SchemaGenerator } from './types'
import type {
  OpenAPI3,
  PathItemObject,
  ParameterObject,
  OperationObject,
  SchemaObject,
} from 'openapi-typescript'

type PartialOpenAPIConfig = Omit<OpenAPI3, 'paths' | 'components' | 'tags' | 'openapi'>

export interface OpenAPIGeneratorConfig {
  openAPI: PartialOpenAPIConfig
}

/**
 * https://swagger.io/specification/
 *
 * spec version: 3.1.0
 *
 * @param option
 * @returns
 */
function createGenerator(option: OpenAPIGeneratorConfig) {
  const _config = {
    requestType: 'application/json',
    responseType: 'application/json',
  }

  const openAPIGenerator: SchemaGenerator<OpenAPI3> = (routes, refs) => {
    const apiSpec: OpenAPI3 = {
      ...option.openAPI,
      openapi: '3.1.0',
      components: {
        // convert to components
        schemas: Object.fromEntries(refs.entries()) as Record<string, SchemaObject>,
      },
      paths: {},
      tags: [],
    }

    // convert to paths
    for (const route of routes) {
      const pathParameters = route.request?.params?.map((n) => toParameterObject(n, 'path'))
      const queryParameters = route.request?.query?.map((n) => toParameterObject(n, 'query'))

      const opObject: OperationObject = {
        // operationId: 'todo',
        parameters: [...(pathParameters || []), ...(queryParameters || [])],
        requestBody: {
          content: {
            [_config.requestType]: {
              schema: route.request?.body as SchemaObject,
            },
          },
        },
        responses: {
          '200': {
            description: 'todo',
            content: {
              [_config.responseType]: {
                schema: route.response as SchemaObject,
              },
            },
          },
        },
      }

      const pathItem = getPathItem(apiSpec, route.path)

      const method = route.method as 'get'
      pathItem[method] = opObject
    }

    return apiSpec
  }

  return openAPIGenerator
}

function getPathItem(openapi: OpenAPI3, path: string) {
  const pathsItem = openapi.paths![path]

  if (!pathsItem) {
    openapi.paths![path] = {}
  }

  return openapi.paths![path] as PathItemObject
}

function toParameterObject(
  config: RouteRequestParam,
  place: ParameterObject['in']
): ParameterObject {
  return {
    name: config.name,
    in: place,
    required: !config.optional,
    description: config.description,
    schema: {
      type: 'string',
    },
  }
}

export default createGenerator
