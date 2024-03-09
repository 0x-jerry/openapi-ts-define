import { A } from './union'
import { Values } from './enum'
import { LiteralObjectType, ObjectType } from './object'

/**
 * interface ref
 */
interface B {
  A: A
  B: number
  E?: Values
  O: ObjectType
  type?: LiteralObjectType
  C?: 1
}

/**
 * type ref
 */
type C = B | A | string
