type G<T = boolean> = {
  a: number
  t: T
}

export type A = G<string>

export interface AG {
  g: G<string>
}
