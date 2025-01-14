import { defRoute } from '../../def'

interface User {
  id: string
  name: string
}

/**
 * Get User Info
 *
 * @api.name get user info
 * @api.info some other information
 *
 * @deprecated
 */
export default defRoute<{ query: { id: string } }, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
