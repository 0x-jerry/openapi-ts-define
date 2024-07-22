import { defRoute } from '../../def'

interface User {
  id: string
  name: string
}

export default defRoute<{ query: { id: string } }, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
