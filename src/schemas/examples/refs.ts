import { Values } from './enum'
import { LiteralObjectType, ObjectType } from './object'

/**
 * interface ref
 */
interface B {
  B: number
  E?: Values
  O: ObjectType
  type?: LiteralObjectType
  C?: 1
}

/**
 * type ref
 */
type C = B | string
