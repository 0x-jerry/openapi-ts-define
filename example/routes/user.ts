import { defRoute } from '../def'

/**
 * User doc
 */
interface User {
  id: string
  name: string
  email?: string
}

export const get = defRoute<
  {
    query: {
      /**
       * id doc
       */
      id?: string
    }
    body: User
  },
  { data: User }
>()

export const post = defRoute<
  {
    body: User
  },
  { data: User }
>()
