export type MapEachFn<I> = (item: I, key: string) => void

export function mapEach<R extends { [key: string]: any } = {}, I = {}>(
  map: R,
  fn: MapEachFn<I>
) {
  Object.keys(map).forEach((key: string) => fn(map[key], key))
}
