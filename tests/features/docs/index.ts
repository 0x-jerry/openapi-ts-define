import { defRoute } from '../../def'

interface User {
  id: string
  name: string
}

/**
 * Get User Info
 */
export default defRoute<{ query: { id: string } }, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
