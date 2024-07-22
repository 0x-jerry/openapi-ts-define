import type { RequestParams } from '../src'
import type { Awaitable } from '@0x-jerry/utils'

interface RouteDefinition<Req, Resp> {
  (req: Req, ctx: any): Awaitable<Resp>
}

export function defRoute<Req extends RequestParams = {}, Resp extends Record<string, any> = {}>(
  fn: RouteDefinition<Req, Resp>
) {
  // todo
}
