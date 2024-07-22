import { defRoute } from '../../def'

interface User {
  id: string
  name: string
  email?: string
}

const handler = defRoute<
  {
    body: User
  },
  { data: User }
>(() => ({} as any))

export default handler
