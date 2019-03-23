import { IFieldProps, IXFieldProps } from './models'

export interface IFormalizerOptions<E = {}> {
  fields?: IFieldProps[]
  xFieldMap?: IXFieldMap<E> | Array<IXFieldMap<E>>
  registerExtraProps?: RegisterExtraProps<E>
  valueAsString?: boolean
  value?: IObjectValue
}

export interface IXFieldMap<E = {}> {
  [key: string]: IXFieldProps<E>
}

export type RegisterExtraProps<E> = (xField: IXFieldProps<E>) => E

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

export interface IXFieldRefMap<E = {}> {
  [key: string]: IXFieldProps<E>
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
  initOnLoad?: boolean
}

export interface IXFieldListenerCallbackProps<E = {}> {
  propName: SafeXFieldKeys<E>
  value: any
  xField: IXFieldProps<E>
}

export type XFieldListenerCallback<E = {}> = ({
  propName,
  value,
  xField,
}: IXFieldListenerCallbackProps<E>) => void

export type XFieldAddListener<E = {}> = (
  callback: XFieldListenerCallback<E>
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

export interface IOnObjectValueChangeProps {
  propName: string
  value: ValueTypes
  valueRefMap: IObjectValue
}

export type OnObjectValueChange = (props: IOnObjectValueChangeProps) => void

export interface IOnObjectValueDeleteProps {
  propName: string
  value: ValueTypes
  valueRefMap: IObjectValue
}

export type OnObjectValueDelete = (props: IOnObjectValueDeleteProps) => void
