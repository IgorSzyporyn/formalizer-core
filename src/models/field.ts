import { IFieldDependencies, ValueTypes } from '../types'

export interface IFieldProps {
  type: string
  name: string
  value?: ValueTypes
  emptyValue?: ValueTypes
  fields?: IFieldProps[]
  dependencies?: IFieldDependencies[]
  title?: string
  subTitle?: string
  description?: string
  disabled?: boolean
}
