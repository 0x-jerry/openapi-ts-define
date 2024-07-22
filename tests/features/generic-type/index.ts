import { defRoute } from '../../def'

type G<T> = {
  t: T
}

export default defRoute(() => {
  const x: G<string> = {
    t: '',
  }

  return x
})
