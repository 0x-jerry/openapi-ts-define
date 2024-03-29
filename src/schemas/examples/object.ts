/**
 * Object Type
 */
export interface ObjectType {
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
export type LiteralObjectType = {
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

interface LiteralValueObject {
  Str: 'string'

  Num: 1111

  TemplateStr: `ssss`

  True?: true

  False: false

  obj: {
    a: number
  }
}
