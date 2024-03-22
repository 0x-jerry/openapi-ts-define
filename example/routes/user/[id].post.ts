import { defRoute } from '../../def'

interface User {
  id: string
  name: string
  email?: string
}

export default defRoute<
  {
    body: User
    params: {
      id: string
    }
  },
  { data: User }
>(() => ({} as any))
