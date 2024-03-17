import type { RequestParams } from '@/types'
import type { Promisable } from '@0x-jerry/utils'

interface RouteDefinition<Req, Resp> {
  (req: Req, ctx: any): Promisable<Resp>
}

export function defRoute<Req extends RequestParams = {}, Resp extends Record<string, any> = {}>(
  fn: RouteDefinition<Req, Resp>
) {
  // todo
}
