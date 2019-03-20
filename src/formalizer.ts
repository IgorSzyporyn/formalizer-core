import deepmerge from 'deepmerge'
import { IFieldProps, XFieldProps } from './models'
import {
  IFormalizerOptions,
  IXFieldMap,
  IXFieldRefMap,
  RegisterExtraProps,
  ValueTypes,
} from './types'
import { fieldsToXFields } from './utils/fieldsToXFields'
import { enhanceXFieldWithDependencies } from './utils/xFieldDependencies'
import { xFieldErrorMessage } from './utils/xFieldErrorMessage'
import { enhanceXFieldWithObjectValues } from './utils/xFieldObjectValues'
import { xFieldsToRefMap } from './utils/xFieldsToRefMap'

export class Formalizer<ExtraProps = {}> {
  public xFieldMap: IXFieldMap<ExtraProps> = {}

  public config: IFormalizerOptions<ExtraProps> = {}

  public fields: IFieldProps[] = []
  public xFields: Array<XFieldProps<ExtraProps>> = []
  public xFieldRefMap: IXFieldRefMap<ExtraProps> = {}
  public values: ValueTypes = {}

  constructor(options?: IFormalizerOptions<ExtraProps>) {
    // Then initialize the config options
    this.initConfig(options)
  }

  private initConfig = (config: IFormalizerOptions<ExtraProps> = {}) => {
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
  }

  private initXFields = (
    fields: IFieldProps[],
    registerExtraProps?: RegisterExtraProps<ExtraProps>
  ) => {
    // Convert the "regular" field to a xField with
    // value type safety via valueType property,
    // adds the xValue object and empower it with the
    // ability to add a listener for xField changes
    const xFields = fieldsToXFields<ExtraProps>({
      fields,
      registerExtraProps,
      xFieldMap: this.xFieldMap,
    })

    this.xFields = xFields
  }

  private initXFieldRefMap = (xFields?: Array<XFieldProps<ExtraProps>>) => {
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

  private registerXFieldMap = (
    applicantMaps: IXFieldMap<ExtraProps> | Array<IXFieldMap<ExtraProps>>
  ) => {
    const { registerXField } = this

    const maps: Array<IXFieldMap<ExtraProps>> = !Array.isArray(applicantMaps)
      ? [applicantMaps]
      : applicantMaps

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
