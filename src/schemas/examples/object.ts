/**
 * Object Type
 */
interface ObjectType {
  /**
   * string
   */
  s: string
  /**
   * number
   */
  n: number
  /**
   * boolean
   */
  b: boolean
  /**
   * optional string
   */
  o?: string
}

/**
 * Literal Object Type
 */
type LiteralObjectType = {
  /**
   * string
   */
  s: string
  /**
   * number
   */
  n: number
  /**
   * boolean
   */
  b: boolean
  /**
   * optional string
   */
  o?: string
}
