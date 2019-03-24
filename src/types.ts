export interface IFormalizerOptions<E = {}> {
  fields?: Array<IFieldProps<E>>
  xFieldMap?: IXFieldMap<E> | Array<IXFieldMap<E>>
  registerExtraProps?: RegisterExtraProps<E>
  value?: IObjectValue
  onChange?: () => void
  onDirtyChange?: (dirty: boolean) => void
  onTouchedChange?: (touched: boolean) => void
  onValidChange?: (valid: boolean) => void
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

export interface IFieldDependency {
  name: string
  matchProp: SafeXFieldKeys
  matchValue?: any
  matchAnyOf?: any[]
  matchAllOf?: any[]
  matchNoneOf?: any[]
  targetProp: string
  successValue?: any
  failureValue?: any
  preventInitOnLoad?: boolean
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

export type ArrayValue = ValueTypes[]

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

export interface IFieldProps<ExtraProps = {}> {
  type: string
  name: string
  value?: ValueTypes
  emptyValue?: ValueTypes
  defaultValue?: ValueTypes
  fields?: Array<IFieldProps<ExtraProps>>
  dependencies?: IFieldDependency[]
  title?: string
  description?: string
  disabled?: boolean
  nullable?: boolean
  extraProps?: ExtraProps
}

export interface IFieldPropPicks
  extends Pick<IFieldProps, Exclude<keyof IFieldProps, 'name' | 'fields'>> {}

export interface IXFieldProps<ExtraProps = {}> extends IFieldPropPicks {
  name?: string
  valueType: XValueTypes
  fields?: Array<IXFieldProps<ExtraProps>>
  extraProps: ExtraProps
  dirty?: boolean
  touched?: boolean
  initialValue?: ValueTypes

  // Internally used props
  $id?: string
  addListener?: XFieldAddListener<ExtraProps>
}

export interface IFieldPropPicks
  extends Pick<IFieldProps, Exclude<keyof IFieldProps, 'name' | 'fields'>> {}

export interface IXFieldProps<ExtraProps = {}> extends IFieldPropPicks {
  name?: string
  valueType: XValueTypes
  fields?: Array<IXFieldProps<ExtraProps>>
  extraProps: ExtraProps
  dirty?: boolean
  touched?: boolean
  initialValue?: ValueTypes

  // Internally used props
  $id?: string
  addListener?: XFieldAddListener<ExtraProps>
}

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
