export type XValueTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'none'

export interface XValue {
  type: XValueTypes
  value: string
}

export interface XValues {
  [key: string]: XValue
}
