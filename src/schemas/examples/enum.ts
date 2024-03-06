/**
 * Switch Value
 */
enum Values {
  On,
  Off,
}

enum StingEnum {
  A = 'a',
  B = 'b',
  C = 'c',
}

enum NumEnum {
  A = 1,
  B,
  C = 5,
  D,
}

enum MixEnum {
  A = 'a',
  B = 1,
  C = 'b',
  D = 2,
  /**
   * should be 3
   */
  E,
  F = 'c',
  G = 'd',
}
