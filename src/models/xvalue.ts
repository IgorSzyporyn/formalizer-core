export type XValueTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'none'

export interface IXValue {
  type: XValueTypes
  value: string
}

export interface IXValues {
  [key: string]: IXValue
}
