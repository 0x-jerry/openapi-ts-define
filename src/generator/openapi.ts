import { SimpleRefsManager } from '../schemas/utils'
import type { RouteRequestParam } from '..'
import type { SchemaGenerator, SchemaGeneratorContext } from './types'
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
 * https://spec.openapis.org/oas/v3.0.0
 *
 * spec version: 3.0.0
 *
 * @param option
 * @returns
 */
function createGenerator(option: OpenAPIGeneratorConfig) {
  const _config = {
    requestType: 'application/json',
    responseType: 'application/json',
  }

  const generateOpenAPI: SchemaGenerator<OpenAPI3> = (routes, refs) => {
    const apiSpec: OpenAPI3 = {
      ...option.openAPI,
      openapi: '3.0.0',
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

      if (['post', 'put', 'patch'].includes(route.method)) {
        opObject.requestBody = {
          content: {
            [_config.requestType]: {
              schema: route.request?.body as SchemaObject,
            },
          },
        }
      }

      const pathItem = getPathItem(apiSpec, route.path)

      pathItem[route.method as 'get'] = opObject
    }

    return apiSpec
  }

  const ctx: SchemaGeneratorContext<OpenAPI3> = {
    refsManager: new OpenAPIRefsManager(),
    generate: generateOpenAPI,
  }

  return ctx
}

class OpenAPIRefsManager extends SimpleRefsManager {
  keyMap = new Map<string, string>()

  keys = new Set<string>()

  getDataKey(path: string, typeName: string): string {
    return this.calcKey(path, typeName)
  }

  getRefKey(path: string, typeName: string): string {
    const key = this.calcKey(path, typeName)

    return `#/components/schemas/${key}`
  }

  calcKey(path: string, typeName: string): string {
    const uniqueName = path + typeName

    if (this.keyMap.has(uniqueName)) {
      return this.keyMap.get(uniqueName)!
    }

    let key = typeName
    let idx = 0

    while (this.keys.has(key)) {
      key = typeName + idx.toString().padStart(2, '0')
      idx++
    }

    this.keys.add(key)
    this.keyMap.set(uniqueName, key)

    return key
  }
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
