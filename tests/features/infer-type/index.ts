import { defRoute } from '../../def'

interface User {
  id: string
  name: string
  createdAt: Date
}

export default defRoute((req: { query: User }) => {
  const u = {} as User

  return u
})
