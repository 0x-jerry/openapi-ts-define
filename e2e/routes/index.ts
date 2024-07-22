import { defRoute } from '../def'
import type { User } from './_types'

export default defRoute<{ query: { id: string } }, { data: User }>(() => {
  return {
    data: {} as any,
  }
})
