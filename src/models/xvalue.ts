export type XValueTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'array'
  | 'object'

export interface XValue {
  type: XValueTypes
  value: string
}

export interface XValues {
  [key: string]: XValue
}
