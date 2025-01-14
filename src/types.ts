import type { JSONSchema7 } from 'json-schema'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type EmptyObject = {}

export interface RequestParams<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Body extends Record<string, any> = EmptyObject,
  Query extends Record<string, string> = EmptyObject,
  Params extends Record<string, string> = EmptyObject,
> {
  query?: Query
  params?: Params
  body?: Body
}

export type ResponseContent = EmptyObject

export interface RouteRequestParam {
  name: string
  description?: string
  optional?: boolean
}

export interface RouteConfig {
  path: string
  method: string
  description?: string

  request?: {
    query?: RouteRequestParam[]
    params?: RouteRequestParam[]
    body?: JSONSchema7
  }

  response?: JSONSchema7

  meta: {
    filepath: string
  }
}
