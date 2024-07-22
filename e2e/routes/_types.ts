/**
 * User doc
 */
export interface User {
  id: string
  name: string
  email?: string
}

export type RequestType = {
  query: {
    /**
     * id doc
     */
    id?: string
    name: string
  }
  body: User
}
