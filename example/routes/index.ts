import { defRoute } from '../def'
import type { User } from './_types'

interface Req {
  query: {
    email?: string
  }
  params: {
    id: string
  }
  body: User
}

export const get = defRoute((_req: Req, _ctx) => {
  return {
    data: 'hello',
  }
})
