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

export const get = defRoute<
  RequestType,
  { data: User }
>()

interface RequestInterface {
  body: User
}

export const post = defRoute<
  RequestInterface,
  { data: User }
>()
