/**
 * Switch Value
 */
export enum Values {
  On = 0,
  Off = 1,
}

enum StingEnum {
  A = 'a',
  B = 'b',
  C = 'c',
}

enum NumEnum {
  A = 1,
  B = 2,
  C = 5,
  D = 6,
}

enum MixEnum {
  A = 'a',
  B = 1,
  C = 'b',
  D = 2,
  /**
   * should be 3
   */
  E = 3,
  F = 'c',
  G = 'd',
}
