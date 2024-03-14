import type { JSONSchema7 } from "json-schema"

export interface RequestParams<
  Body extends Record<string, any> = {},
  Query extends Record<string, string> = {},
  Params extends Record<string, string> = {}
> {
  query?: Query
  params?: Params
  body?: Body
}

export interface ResponseContent { }


export interface RouteReqeustQuery {
  name: string
  optional?: boolean
}

export interface RouteConfig {
  path: string
  method: string

  request?: {
    query?: RouteReqeustQuery[]
    params?: RouteReqeustQuery[]

    // todo, should be a json schema or ref schema
    body?: JSONSchema7
  }

  // todo, should be a json schema or ref schema
  response?: JSONSchema7
}
