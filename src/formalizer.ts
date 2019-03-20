import deepmerge from 'deepmerge'
import { isArray } from 'lodash'
import { IFieldProps, XFieldProps, xFieldMap as xFieldCoreMap } from './models'
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

  protected formalizer = '1.0.0'

  constructor(options: IFormalizerOptions<ExtraProps> = {}) {
    const { xFieldMap, fields, registerExtraProps } = options

    this.registerXFieldMap(xFieldMap)

    this.initFields(fields)
    this.initXFields(fields, registerExtraProps)
    this.initXFieldRefMap()
    this.initXFieldDependencies()
    this.initObjectXFields()
  }

  private initFields = (fields: IFieldProps[] = []) => {
    this.fields = fields
  }

  private initXFields = (
    fields: IFieldProps[] = [],
    registerExtraProps?: RegisterExtraProps<ExtraProps>
  ) => {
    const xFields = fieldsToXFields<ExtraProps>({
      fields,
      registerExtraProps,
      xFieldMap: this.xFieldMap,
    })

    this.xFields = xFields
  }

  private initXFieldRefMap = (xFields?: Array<XFieldProps<ExtraProps>>) => {
    const xFieldRefMap = xFieldsToRefMap<ExtraProps>(xFields || this.xFields)

    this.xFieldRefMap = xFieldRefMap
  }

  private initXFieldDependencies = () => {
    const { xFieldRefMap } = this

    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]

      if (xField.dependencies) {
        enhanceXFieldWithDependencies<ExtraProps>(xField, xFieldRefMap)
      }
    })
  }

  private initObjectXFields = () => {
    const { xFieldRefMap } = this

    Object.keys(xFieldRefMap).forEach(key => {
      const xField = xFieldRefMap[key]

      enhanceXFieldWithObjectValues<ExtraProps>(xField)
    })
  }

  private registerXFieldMap = (
    applicantMaps?: IXFieldMap<ExtraProps> | Array<IXFieldMap<ExtraProps>>
  ) => {
    const { registerXField } = this

    const applicants = applicantMaps
      ? isArray(applicantMaps)
        ? applicantMaps
        : [applicantMaps]
      : []

    const coreMaps: Array<IXFieldMap<ExtraProps>> = [
      xFieldCoreMap as IXFieldMap<ExtraProps>,
    ]

    const maps = coreMaps.concat(applicants)

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
