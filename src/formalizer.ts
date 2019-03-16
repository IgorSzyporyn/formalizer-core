import { FieldProps, XFieldMap, XFieldProps, xFieldMap } from './models'
import {
  FormalizerOptions,
  RegisterExtraProps,
  XFieldsRefMap,
  ValueTypes,
} from './types'
import { xFieldsToRefMap } from './utils/xFieldsToRefMap'
import { fieldsToXFields } from './utils/fieldsToXFields'
import { registerXTypeError } from './utils/registerXTypeError'
import { enhanceXFieldWithDependencies } from './utils/xFieldDependencies'

export class formalizer<ExtraProps = {}> {
  public xFieldMap: XFieldMap<ExtraProps> = {}

  public config: FormalizerOptions<ExtraProps> = {}

  public fields: FieldProps[] = []
  public xFields: XFieldProps<ExtraProps>[] = []
  public xFieldsRefMap: XFieldsRefMap<ExtraProps> = {}
  public values: ValueTypes = {}

  constructor(options?: FormalizerOptions<ExtraProps>) {
    // Fetch and register the core xFieldMap
    const coreXFieldMap = xFieldMap<ExtraProps>()
    this.registerXFieldMap(coreXFieldMap)

    // Then initialize the config options
    this.initConfig(options)
  }

  private initConfig = (config: FormalizerOptions<ExtraProps> = {}) => {
    const { xFieldMap, fields, registerExtraProps } = config

    if (xFieldMap) {
      this.registerXFieldMap(xFieldMap)
    }

    if (fields) {
      this.fields = fields
      this.initXFields(fields, registerExtraProps)
      this.xFieldsRefMap = this.initXFieldsRefMap()
      this.initDependencies()
    }

    this.initValues()
  }

  private initXFields = (
    fields: FieldProps[],
    registerExtraProps?: RegisterExtraProps<ExtraProps>
  ) => {
    // Convert the "regular" field to a xField with
    // value type safety via valueType property,
    // adds the xValue object and empower it with the
    // ability to add a listener for xField changes
    const xFields = fieldsToXFields<ExtraProps>({
      fields,
      xFieldMap: this.xFieldMap,
      registerExtraProps,
    })

    this.xFields = xFields
  }

  private initXFieldsRefMap = (xFields?: XFieldProps<ExtraProps>[]) => {
    const xFieldsRefMap = xFieldsToRefMap<ExtraProps>(xFields || this.xFields)

    return xFieldsRefMap
  }

  private initDependencies = () => {
    const { xFieldsRefMap } = this

    Object.keys(xFieldsRefMap).forEach(key => {
      const xField = xFieldsRefMap[key]

      if (xField.dependencies) {
        enhanceXFieldWithDependencies<ExtraProps>(xField, xFieldsRefMap)
      }
    })
  }

  private initValues = () => {}

  private registerXFieldMap = (applicantMap: XFieldMap<ExtraProps>) => {
    const { registerXType } = this

    Object.keys(applicantMap).forEach(key => {
      const xType = applicantMap[key]

      if (xType.type === key) {
        registerXType(xType)
      } else {
        registerXTypeError(key, 'because the key did not match the type')
      }
    })
  }

  private registerXType = (xType: XFieldProps<ExtraProps>) => {
    const { xFieldMap } = this

    if (xType.type && xType.valueType && !xFieldMap[xType.type]) {
      this.xFieldMap[xType.type] = xType
    } else {
      let errorMessage = ' because something went wrong'
      if (xType.type && xFieldMap[xType.type]) {
        errorMessage = 'since it already exists'
      } else if (!xType.valueType) {
        errorMessage = 'because it is missing the property "valueType"'
      }

      registerXTypeError(xType.type, errorMessage)
    }
  }
}
