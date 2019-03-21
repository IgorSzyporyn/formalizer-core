import { IFieldDependencies, ValueTypes } from '../types'

export interface IFieldProps {
  type: string
  name: string
  value?: ValueTypes
  emptyValue?: ValueTypes
  defaultValue?: ValueTypes
  fields?: IFieldProps[]
  dependencies?: IFieldDependencies[]
  title?: string
  description?: string
  disabled?: boolean
}
