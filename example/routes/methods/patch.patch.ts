import { defRoute } from '../../def'
import type { User } from '../_types'

const handler = defRoute<
  {
    body: User
  },
  { data: User }
>(() => ({} as any))

export default handler
