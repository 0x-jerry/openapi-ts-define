import { defRoute } from '../../def'

interface User {
  id: string
  name: string
  email?: string
}

export default defRoute<
  {
    body: User
  },
  { data: User }
>(() => ({} as any))
