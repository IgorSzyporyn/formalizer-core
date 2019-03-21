import { IFieldProps, IXFieldProps } from './models'

export interface IFormalizerOptions<ExtraProps = {}> {
  fields?: IFieldProps[]
  xFieldMap?: IXFieldMap<ExtraProps> | Array<IXFieldMap<ExtraProps>>
  registerExtraProps?: RegisterExtraProps<ExtraProps>
  valuesAsString?: boolean
  values?: IObjectValue
}

export interface IXFieldMap<ExtraProps = {}> {
  [key: string]: IXFieldProps<ExtraProps>
}

export type RegisterExtraProps<ExtraProps> = (
  xField: IXFieldProps<ExtraProps>
) => ExtraProps

export type SafeXFieldProps<U = {}> = Pick<
  IXFieldProps<U>,
  Exclude<keyof IXFieldProps<U>, 'addListener'>
>

export type SafeXFieldKeys<U = {}> = keyof SafeXFieldProps<U>

export type FieldKeys = keyof IFieldProps

export interface IOnXFieldChangeProps<U = {}> {
  propName: SafeXFieldKeys<U>
  value: any
  xField: IXFieldProps<U>
}

export type OnXFieldChange<U = {}> = (props: IOnXFieldChangeProps<U>) => void

export interface IXFieldRefMap<ExtraProps = {}> {
  [key: string]: IXFieldProps<ExtraProps>
}

export interface IValueRefMap {
  [key: string]: ValueTypes
}

export interface IFieldDependencies {
  name: string
  matchProp: SafeXFieldKeys
  matchValue?: any
  matchAnyOf?: any[]
  matchAllOf?: any[]
  matchNoneOf?: any[]
  targetProp: string
  successValue?: any
  failureValue?: any
}

export interface IXFieldListenerCallbackProps<ExtraProps = {}> {
  propName: SafeXFieldKeys<ExtraProps>
  value: any
  xField: IXFieldProps<ExtraProps>
}

export type XFieldListenerCallback<ExtraProps = {}> = ({
  propName,
  value,
  xField,
}: IXFieldListenerCallbackProps<ExtraProps>) => void

export type XFieldAddListener<ExtraProps = {}> = (
  callback: XFieldListenerCallback<ExtraProps>
) => void

export interface IObjectValue {
  [key: string]: ValueTypes
}

export type ValueTypes =
  | string
  | number
  | boolean
  | IObjectValue
  | any[]
  | undefined
  | null
