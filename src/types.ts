export interface IFormalizerOptions<E = {}> {
  fields?: Array<IFieldProps<E>>
  xFieldMap?: IXFieldMap<E> | Array<IXFieldMap<E>>
  registerExtraProps?: RegisterExtraProps<E>
  value?: IValue
  onDirtyChange?: (dirty: boolean) => void
  onTouchedChange?: (touched: boolean) => void
  onValidChange?: (valid: boolean) => void
  onFieldChange?: (change: IOnXFieldChangeProps<E>) => void
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

export interface IValue {
  [key: string]: ValueTypes
}

export type ArrayValueType = ValueTypes[]

export type ValueTypes =
  | string
  | number
  | boolean
  | IValue
  | any[]
  | undefined
  | null

export interface IOnObjectValueChangeProps {
  propName: string
  value: ValueTypes
  valueRefMap: IValue
}

export type OnObjectValueChange = (props: IOnObjectValueChangeProps) => void

export interface IOnObjectValueDeleteProps {
  propName: string
  value: ValueTypes
  valueRefMap: IValue
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
  validation?: IValidationSchema
  validationMessages?: IValidationMessages
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
  error?: string
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

export interface IValidationErrors {
  [key: string]: string
}

export type ValidateFn = (value: IValue) => Promise<IValidationErrors>

export type ValidationSchemaFormatTypes =
  | 'date'
  | 'time'
  | 'date-time'
  | 'email'
  | 'idn-email'

export type ValidationSchemaProps =
  | 'type'
  | 'enum'
  | 'const'
  | 'multipleOf'
  | 'maximum'
  | 'exclusiveMaximum'
  | 'minimum'
  | 'exclusiveMinimum'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'items'
  | 'additionalItems'
  | 'maxItems'
  | 'minItems'
  | 'uniqueItems'
  | 'contains'
  | 'maxProperties'
  | 'minProperties'
  | 'required'
  | 'mandatory'
  | 'properties'
  | 'patternProperties'
  | 'additionalProperties'
  | 'dependencies'
  | 'propertyNames'
  | 'if'
  | 'then'
  | 'else'
  | 'allOf'
  | 'anyOf'
  | 'oneOf'
  | 'not'
  | 'format'

export type ValidationSchemaTypeTypes =
  | 'null'
  | 'boolean'
  | 'object'
  | 'array'
  | 'number'
  | 'string'

export interface IValidationSchema {
  /**
   *  KEYWORD FOR: ANY INSTANCE TYPE
   *
   *  The value of this keyword MUST be either a string or an array.
   *  If it is an array, elements of the array MUST be strings and
   *  MUST be unique.
   *
   *  String values MUST be one of the six primitive types
   *  ("null", "boolean", "object", "array", "number", or "string"),
   *  or "integer" which matches any number with a zero fractional part.
   *  NOTE: Right now we just support string
   */
  type?: ValidationSchemaTypeTypes

  /**
   *  KEYWORD FOR: ANY INSTANCE TYPE
   *
   *  The value of this keyword MUST be an array.
   *  This array SHOULD have at least one element.
   *  Elements in the array SHOULD be unique.
   *
   *  An instance validates successfully against this keyword if its value is
   *  equal to one of the elements in this keyword's array value.
   */
  enum?: any[]

  /**
   *  KEYWORD FOR: ANY INSTANCE TYPE
   *
   *  The value of this keyword MAY be of any type, including null.
   *
   *  An instance validates successfully against this keyword if its value is
   *  equal to the value of the keyword.
   */
  const?: any

  /**
   *  KEYWORD FOR: NUMERIC INSTANCE TYPE
   *
   *  The value of "multipleOf" MUST be a number, strictly greater than 0.
   *
   *  A numeric instance is valid only if division by this keyword's value
   *  results in an integer.
   */
  multipleOf?: number

  /**
   *  KEYWORD FOR: NUMERIC INSTANCE TYPE
   *
   *  The value of "maximum" MUST be a number, representing an inclusive upper
   *  limit for a numeric instance.
   *
   *  If the instance is a number, then this keyword validates only if the
   *  instance is less than or exactly equal to "maximum".
   */
  maximum?: number

  /**
   *  KEYWORD FOR: NUMERIC INSTANCE TYPE
   *
   *  The value of "exclusiveMaximum" MUST be number, representing an exclusive
   *  upper limit for a numeric instance.
   *
   *  If the instance is a number, then the instance is valid only if it has a
   *  value strictly less than (not equal to) "exclusiveMaximum".
   */
  exclusiveMaximum?: number

  /**
   *  KEYWORD FOR: NUMERIC INSTANCE TYPE
   *
   *  The value of "minimum" MUST be a number, representing an inclusive lower
   *  limit for a numeric instance.
   *
   *  If the instance is a number, then this keyword validates only if the
   *  instance is greater than or exactly equal to "minimum".
   */
  minimum?: number

  /**
   *  KEYWORD FOR: NUMERIC INSTANCE TYPE
   *
   *  The value of "exclusiveMinimum" MUST be number, representing an exclusive
   *  lower limit for a numeric instance.
   *
   *  If the instance is a number, then the instance is valid only if it has a
   *  value strictly greater than (not equal to) "exclusiveMinimum"
   */
  exclusiveMinimum?: number

  /**
   *  KEYWORD FOR: STRING INSTANCE TYPE
   *
   *  The value of this keyword MUST be a non-negative integer.
   *
   *  A string instance is valid against this keyword if its length is less
   *  than, or equal to, the value of this keyword.
   *
   *  The length of a string instance is defined as the number of its characters
   *  as defined by RFC7159
   *  https://json-schema.org/latest/json-schema-validation.html#RFC7159
   */
  maxLength?: number

  /**
   *  KEYWORD FOR: STRING INSTANCE TYPE
   *
   *  The value of this keyword MUST be a non-negative integer.
   *
   *  A string instance is valid against this keyword if its length is greater
   *  than, or equal to, the value of this keyword.
   *
   *  The length of a string instance is defined as the number of its characters
   *  as defined by RFC7159
   *  https://json-schema.org/latest/json-schema-validation.html#RFC7159
   */
  minLength?: number

  /**
   *  KEYWORD FOR: STRING INSTANCE TYPE
   *
   *  The value of this keyword MUST be a string. This string SHOULD be a valid
   *  regular expression, according to the ECMA 262 regular expression dialect.
   *
   *  A string instance is considered valid if the regular expression matches
   *  the instance successfully.
   *
   *  Recall: regular expressions are not implicitly anchored.
   */
  pattern?: string

  /**
   *  KEYWORD FOR: ARRAY INSTANCE TYPE
   *
   *  The value of "items" MUST be an array of valid JSON Schemas.
   *
   *  This keyword determines how child instances validate for arrays, and does
   *  not directly validate the immediate instance itself.
   *
   *  If "items" is a schema, validation succeeds if all elements in the array
   *  successfully validate against that schema.
   *
   *  If "items" is an array of schemas, validation succeeds if each element of
   *  the instance validates against the schema at the same position, if any.
   *
   *  Omitting this keyword has the same behavior as an empty schema.
   */
  items?: IValidationSchema[]

  /**
   *  KEYWORD FOR: ARRAY INSTANCE TYPE
   *
   *  The value of "additionalItems" MUST be a valid JSON Schema.
   *
   *  This keyword determines how child instances validate for arrays, and does
   *  not directly validate the immediate instance itself.
   *
   *  If "items" is an array of schemas, validation succeeds if every instance
   *  element at a position greater than the size of "items" validates against
   *  "additionalItems".
   *
   *  Otherwise, "additionalItems" MUST be ignored, as the "items" schema
   *  (possibly the default value of an empty schema) is applied to all
   *  elements.
   *
   *  Omitting this keyword has the same behavior as an empty schema.
   */
  additionalItems?: IValidationSchema

  /**
   *  KEYWORD FOR: ARRAY INSTANCE TYPE
   *
   *  The value of this keyword MUST be a non-negative integer.
   *
   *  An array instance is valid against "maxItems" if its size is less than,
   *  or equal to, the value of this keyword.
   */
  maxItems?: number

  /**
   *  KEYWORD FOR: ARRAY INSTANCE TYPE
   *
   *  The value of this keyword MUST be a non-negative integer.
   *
   *  An array instance is valid against "minItems" if its size is greater than,
   *  or equal to, the value of this keyword.
   *
   *  Omitting this keyword has the same behavior as a value of 0.
   */
  minItems?: number

  /**
   *  KEYWORD FOR: ARRAY INSTANCE TYPE
   *
   *  The value of this keyword MUST be a boolean.
   *
   *  If this keyword has boolean value false, the instance validates
   *  successfully.
   *  If it has boolean value true, the instance validates successfully if all
   *  of its elements are unique.
   *
   *  Omitting this keyword has the same behavior as a value of false.
   */
  uniqueItems?: boolean

  /**
   *  KEYWORD FOR: ARRAY INSTANCE TYPE
   *
   *  The value of this keyword MUST be a valid JSON Schema.
   *
   *  An array instance is valid against "contains" if at least one of its
   *  elements is valid against the given schema.
   */
  contains?: IValidationSchema

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  The value of this keyword MUST be a non-negative integer.
   *
   *  An object instance is valid against "maxProperties" if its number of
   *  properties is less than, or equal to, the value of this keyword.
   */
  maxProperties?: number

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  The value of this keyword MUST be a non-negative integer.
   *
   *  An object instance is valid against "minProperties" if its number of
   *  properties is greater than, or equal to, the value of this keyword.
   *
   *  Omitting this keyword has the same behavior as a value of 0.
   */
  minProperties?: number

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  NOTE: Please notice the existance of "mandatory", which is more suitable
   *  on field level - "mandatory" is NOT a valid JSONSchema keyword though
   *  and will be removed on runtime.
   *  Use "mandatory" when you want to set a field as required directly on the
   *  field.
   *
   *  The value of this keyword MUST be an array.
   *  Elements of this array, if any, MUST be strings, and MUST be unique.
   *
   *  An object instance is valid against this keyword if every item in the
   *  array is the name of a property in the instance.
   *
   *  Omitting this keyword has the same behavior as an empty array.
   */
  required?: string[]

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  NOTE: This is NOT a valid JSON Schema keyword, but an invention by CT to
   *        allow setting the field as required on field level - will be removed
   *        from the compiled JSON Schema
   *
   *  The value of this keyword MUST be a boolean.
   *
   *  An object instance is valid against this keyword if keyword is true.
   *
   *  Omitting this keyword has the same behavior as false.
   */
  mandatory?: boolean

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  The value of "properties" MUST be an object.
   *  Each value of this object MUST be a valid JSON Schema.
   *
   *  This keyword determines how child instances validate for objects, and does
   *  not directly validate the immediate instance itself.
   *
   *  Validation succeeds if, for each name that appears in both the instance
   *  and as a name within this keyword's value, the child instance for that
   *  name successfully validates against the corresponding schema.
   *
   *  Omitting this keyword has the same behavior as an empty object.
   */
  properties?: {
    [key: string]: IValidationSchema
  }

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  The value of "patternProperties" MUST be an object.
   *  Each property name of this object SHOULD be a valid regular expression,
   *  according to the ECMA 262 regular expression dialect.
   *  Each property value of this object MUST be a valid JSON Schema.
   *
   *  This keyword determines how child instances validate for objects,
   *  and does not directly validate the immediate instance itself.
   *  Validation of the primitive instance type against this keyword always
   *  succeeds.
   *
   *  Validation succeeds if, for each instance name that matches any regular
   *  expressions that appear as a property name in this keyword's value, the
   *  child instance for that name successfully validates against each schema
   *  that corresponds to a matching regular expression.
   *
   *  Omitting this keyword has the same behavior as an empty object.
   *
   */
  patternProperties?: { [key: string]: any }

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  The value of "additionalProperties" MUST be a valid JSON Schema.
   *
   *  This keyword determines how child instances validate for objects,
   *  and does not directly validate the immediate instance itself.
   *
   *  Validation with "additionalProperties" applies only to the child values
   *  of instance names that do not match any names in "properties", and do not
   *  match any regular expression in "patternProperties".
   *
   *  For all such properties, validation succeeds if the child instance
   *  validates against the "additionalProperties" schema.
   *
   *  Omitting this keyword has the same behavior as an empty schema.
   */
  additionalProperties?: IValidationSchema

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  This keyword specifies rules that are evaluated if the instance is an
   *  object and contains a certain property.
   *
   *  This keyword's value MUST be an object. Each property specifies a
   *  dependency.
   *  Each dependency value MUST be an array or a valid JSON Schema.
   *
   *  If the dependency value is a subschema, and the dependency key is a
   *  property in the instance, the entire instance must validate against the
   *  dependency value.
   *
   *  If the dependency value is an array, each element in the array, if any,
   *  MUST be a string, and MUST be unique. If the dependency key is a property
   *  in the instance, each of the items in the dependency value must be a
   *  property that exists in the instance.
   *
   *  Omitting this keyword has the same behavior as an empty object.
   */
  dependencies?: {
    [key: string]: any
  }

  /**
   *  KEYWORD FOR: OBJECT INSTANCE TYPE
   *
   *  The value of "propertyNames" MUST be a valid JSON Schema.
   *
   *  If the instance is an object, this keyword validates if every property
   *  name in the instance validates against the provided schema. Note the
   *  property name that the schema is testing will always be a string.
   *
   *  Omitting this keyword has the same behavior as an empty schema.
   */
  propertyNames?: IValidationSchema

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS CONDITIONALLY
   *
   *  This keyword's value MUST be a valid JSON Schema.
   *
   *  This validation outcome of this keyword's subschema has no direct effect
   *  on the overall validation result.
   *  Rather, it controls which of the "then" or "else" keywords are evaluated.
   *
   *  Instances that successfully validate against this keyword's subschema MUST
   *  also be valid against the subschema value of the "then" keyword, if
   *  present.
   *
   *  Instances that fail to validate against this keyword's subschema MUST also
   *  be valid against the subschema value of the "else" keyword, if present.
   *
   *  If annotations are being collected, they are collected from this keyword's
   *  subschema in the usual way, including when the keyword is present without
   *  either "then" or "else".
   *  https://json-schema.org/latest/json-schema-validation.html#annotations
   *
   */
  if?: IValidationSchema

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS CONDITIONALLY
   *
   *  This keyword's value MUST be a valid JSON Schema.
   *
   *  When "if" is present, and the instance successfully validates against its
   *  subschema, then valiation succeeds against this keyword if the instance
   *  also successfully validates against this keyword's subschema.
   *
   *  This keyword has no effect when "if" is absent, or when the instance fails
   *  to validate against its subschema.
   *  Implementations MUST NOT evaluate the instance against this keyword, for
   *  either validation or annotation collection purposes, in such cases.
   *
   */
  then?: IValidationSchema

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS CONDITIONALLY
   *
   *  This keyword's value MUST be a valid JSON Schema.
   *
   *  When "if" is present, and the instance fails to validate against its
   *  subschema, then valiation succeeds against this keyword if the instance
   *  successfully validates against this keyword's subschema.
   *
   *  This keyword has no effect when "if" is absent, or when the instance
   *  successfully validates against its subschema.
   *  Implementations MUST NOT evaluate the instance against this keyword,
   *  for either validation or annotation collection purposes, in such cases.
   */
  else?: IValidationSchema

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS WITH BOOLEAN LOGIC
   *
   *  This keyword's value MUST be a non-empty array.
   *  Each item of the array MUST be a valid JSON Schema.
   *
   *  An instance validates successfully against this keyword if it validates
   *  successfully against all schemas defined by this keyword's value.
   */
  allOf?: IValidationSchema[]

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS WITH BOOLEAN LOGIC
   *
   *  This keyword's value MUST be a non-empty array.
   *  Each item of the array MUST be a valid JSON Schema.
   *
   *  An instance validates successfully against this keyword if it validates
   *  successfully against at least one schema defined by this keyword's value.
   */
  anyOf?: IValidationSchema[]

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS WITH BOOLEAN LOGIC
   *
   *  This keyword's value MUST be a non-empty array.
   *  Each item of the array MUST be a valid JSON Schema.
   *
   *  An instance validates successfully against this keyword if it validates
   *  successfully against exactly one schema defined by this keyword's value.
   */
  oneOf?: IValidationSchema[]

  /**
   *  KEYWORD FOR: APPLYING SUBSCHEMAS WITH BOOLEAN LOGIC
   *
   *  This keyword's value MUST be a valid JSON Schema.
   *
   *  An instance is valid against this keyword if it fails to validate
   *  successfully against the schema defined by this keyword.
   */
  not?: IValidationSchema

  /**
   *  SEMANTIC VALIDATION WITH "format"
   *
   *  date:       A string instance is valid against this attribute if it is
   *              a valid representation according to the "full-date"
   *              production.
   *
   *  time:       A string instance is valid against this attribute if it is a
   *              valid representation according to the "full-time" production.
   *
   *  date-time:  A string instance is valid against this attribute if it is a
   *              valid representation according to the "date-time" production.
   *
   *  email:      As defined by RFC 5322, section 3.4.1 [RFC5322].
   *  https://json-schema.org/latest/json-schema-validation.html#RFC5322
   *
   *  idn-email:  As defined by RFC 6531 [RFC6531]
   *  https://json-schema.org/latest/json-schema-validation.html#RFC6531
   *
   */
  format?: ValidationSchemaFormatTypes
}

export type IValidationMessages = {
  [key in ValidationSchemaProps]?: string
} & { [key: string]: string }

export interface IValidationMessagesMap {
  [key: string]: IValidationMessages
}
