import { cloneDeep } from 'lodash'
import {
  IFieldProps,
  IFormalizerOptions,
  IObjectValue,
  IXFieldMap,
  IXFieldProps,
  IXFieldRefMap,
} from './types'
import {
  initValue,
  initXFieldArrayCapability,
  initXFieldDependencies,
  initXFieldMap,
  initXFieldObjectCapability,
  initXFieldRefMap,
  initXFieldStateHandlers,
  initXFields,
} from './utils/initialize'
import { xFieldMap as xFieldCoreMap } from './xFieldMap'

export class Formalizer<ExtraProps = {}> {
  public config: IFormalizerOptions<ExtraProps> = {}

  public fields: Array<IFieldProps<ExtraProps>> = []

  public xFields: Array<IXFieldProps<ExtraProps>> = []
  public xFieldMap: IXFieldMap<ExtraProps> = {}
  public xFieldRefMap: IXFieldRefMap<ExtraProps> = {}

  public value: IObjectValue = {}
  public initialValue: IObjectValue = {}

  public dirty: boolean = false
  public touched: boolean = false
  public valid: boolean = false

  protected formalizer = '1.0.0'

  constructor(options: IFormalizerOptions<ExtraProps> = {}) {
    const { registerExtraProps } = options
    const config = (this.config = options)

    // Initialize the given fields from options and safeguard
    const fields = (this.fields = options.fields || [])

    // Initialize the xFieldMap with core as safeguard
    // for ability to handle the core types
    // string, number, boolean, object and array
    const xFieldMap = (this.xFieldMap = initXFieldMap({
      applicantMaps: config.xFieldMap,
      xFieldCoreMap,
    }))

    // Initialize and convert the given fields to xFields
    // using the xFieldMap as catalyst - registerExtraProps
    // lets the user send in a function which return statement
    // will be merged on top of the returned xFields extraProps
    this.xFields = initXFields({
      fields,
      registerExtraProps,
      xFieldMap,
    })

    // Initialize and create the flat dot notated object holding
    // all the xFields in the formalizer instance
    this.xFieldRefMap = initXFieldRefMap<ExtraProps>(this.xFields)

    // Enrich the xFields with dependency capabilities
    initXFieldDependencies<ExtraProps>(this.xFieldRefMap)

    // Enrich the xFields with valueType set to "object" with capabilities
    // to handle child properties up and down the tree
    initXFieldObjectCapability<ExtraProps>(this.xFieldRefMap)

    // Enrich the xFields with valueType set to "array" with capabilities
    // to handle child properties and values
    initXFieldArrayCapability<ExtraProps>(this.xFieldRefMap)

    // Enrich the xFields with valueType set to "array" with capabilities
    // to handle child properties in the array fields
    // @TODO

    // Initialize and create the value object in the formalizer instance
    const { handleValueChange } = this

    this.value = initValue<ExtraProps>({
      initialValue: options.value,
      xFieldRefMap: this.xFieldRefMap,
      onChange: handleValueChange,
      onDelete: handleValueChange,
    })

    this.initialValue = cloneDeep(this.value)

    // Now relationships and values have been established we also need to
    // introduce dirty and touched states on our fields
    initXFieldStateHandlers<ExtraProps>(this.xFieldRefMap)
  }

  // Keep value object updated, keep xValue object updated and
  // keep dirty, valid and touched updated
  private handleValueChange = () => {
    this.dirty =
      JSON.stringify(this.value) !== JSON.stringify(this.initialValue)

    if (this.dirty) {
      this.touched = true
    }
  }
}
