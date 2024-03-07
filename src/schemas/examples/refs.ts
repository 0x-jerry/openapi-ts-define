import { A } from './union'

/**
 * interface ref
 */
interface B {
  A: A
  B: number
  C?: 1
}

/**
 * type ref
 */
type C = B | A | string
