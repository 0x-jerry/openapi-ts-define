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

  request: {
    query?: RouteReqeustQuery[]
    params?: string[]

    // todo, should be a json schema or ref schema
    body?: any
  }

  // todo, should be a json schema or ref schema
  response?: any
}
