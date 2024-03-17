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

export const get = defRoute<RequestType, { data: User }>(() => {
  return {
    data: {} as any,
  }
})

interface RequestInterface {
  body: User
}

export const post = defRoute<RequestInterface, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
