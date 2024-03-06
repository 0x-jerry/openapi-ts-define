import { defRoute } from '../../def'

interface User {
  id: string
  name: string
  email?: string
}

export const get = defRoute<
  {
    query: {
      id?: string
    }
  },
  { data: User }
>()

export const post = defRoute<
  {
    body: User
  },
  { data: User }
>()