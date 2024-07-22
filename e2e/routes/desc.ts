import { defRoute } from '../def'
import type { User } from './_types'

interface Req {
  query: {
    /**
     * Email address.
     */
    email?: string
  }
  body: User
}

export default defRoute((_req: Req, _ctx) => {
  return {
    data: 'hello',
  }
})
