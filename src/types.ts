import type { JSONSchema7 } from 'json-schema'

export interface RequestParams<
  Body extends Record<string, any> = {},
  Query extends Record<string, string> = {},
  Params extends Record<string, string> = {}
> {
  query?: Query
  params?: Params
  body?: Body
}

export interface ResponseContent {}

export interface RouteRequestParam {
  name: string
  description?: string
  optional?: boolean
}

export interface RouteConfig {
  path: string
  method: string

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
