import { defRoute } from '../def'
import type { RequestType } from './_types'

/**
 * User doc
 */
interface User {
  id: string
  name: string
  email?: string
}

export default defRoute<RequestType, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
