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
