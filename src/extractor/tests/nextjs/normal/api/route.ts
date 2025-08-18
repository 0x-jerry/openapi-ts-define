import { defRoute } from '../../../def'

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
export const GET = defRoute<{ query: { id: string } }, { data: User }>(() => {
  return {
    data: {} as any,
  }
})

/**
 * Get User Info
 *
 * @api.name get user info
 * @api.info some other information
 *
 * @deprecated
 */
export const POST = defRoute<{ body: { id: string } }, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
