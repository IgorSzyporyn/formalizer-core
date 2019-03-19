import { FieldProps, XFieldProps } from './models'
import {
  FormalizerOptions,
  RegisterExtraProps,
  XFieldRefMap,
  ValueTypes,
  XFieldMap,
} from './types'
import { xFieldsToRefMap } from './utils/xFieldsToRefMap'
import { fieldsToXFields } from './utils/fieldsToXFields'
import { xFieldErrorMessage } from './utils/xFieldErrorMessage'
import { enhanceXFieldWithDependencies } from './utils/xFieldDependencies'
import { enhanceXFieldWithObjectValues } from './utils/xFieldObjectValues'
import deepmerge from 'deepmerge'

export class formalizer<ExtraProps = {}> {
  public xFieldMap: XFieldMap<ExtraProps> = {}

  public config: FormalizerOptions<ExtraProps> = {}

  public fields: FieldProps[] = []
  public xFields: XFieldProps<ExtraProps>[] = []
  public xFieldRefMap: XFieldRefMap<ExtraProps> = {}
  public values: ValueTypes = {}

  constructor(options?: FormalizerOptions<ExtraProps>) {
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
      this.xFieldRefMap = this.initXFieldRefMap()
      this.initDependencies()
      this.initObjectFields()
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

  private initXFieldRefMap = (xFields?: XFieldProps<ExtraProps>[]) => {
    const xFieldRefMap = xFieldsToRefMap<ExtraProps>(xFields || this.xFields)

    return xFieldRefMap
  }

  private initDependencies = () => {
    const { xFieldRefMap } = this

    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]

      if (xField.dependencies) {
        enhanceXFieldWithDependencies<ExtraProps>(xField, xFieldRefMap)
      }
    })
  }

  private initObjectFields = () => {
    const { xFieldRefMap } = this

    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]

      enhanceXFieldWithObjectValues<ExtraProps>(xField)
    })
  }

  private initValues = () => {}

  private registerXFieldMap = (
    applicantMaps: XFieldMap<ExtraProps> | XFieldMap<ExtraProps>[]
  ) => {
    const { registerXField } = this

    let maps: XFieldMap<ExtraProps>[] = []

    if (!Array.isArray(applicantMaps)) {
      maps = [applicantMaps]
    } else {
      maps = applicantMaps
    }

    maps.forEach(applicantMap => {
      Object.keys(applicantMap).forEach(key => {
        const xField = applicantMap[key]

        if (xField.type === key) {
          registerXField(xField)
        } else {
          xFieldErrorMessage(
            key,
            `because the xField key <${key}> did not match the xField type <${
              xField.type
            }>`
          )
        }
      })
    })
  }

  private registerXField = (xField: XFieldProps<ExtraProps>) => {
    const { xFieldMap } = this

    if (xField.type && xField.valueType && !xFieldMap[xField.type]) {
      // Straight up register where xField
      this.xFieldMap[xField.type] = xField
    } else if (xField.type && xField.valueType && xFieldMap[xField.type]) {
      // Register already existing xField by deepmerging
      this.xFieldMap[xField.type] = deepmerge(
        this.xFieldMap[xField.type],
        xField
      )
    } else {
      let errorMessage = 'because something went wrong'
      if (!xField.type) {
        errorMessage = 'because the xField it is missing the property "type"'
      } else if (xField.type && xFieldMap[xField.type]) {
        errorMessage = 'since the xtype already exists'
      } else if (!xField.valueType) {
        errorMessage = 'because it is missing the property "valueType"'
      }

      xFieldErrorMessage(xField.type, errorMessage)
    }
  }
}
