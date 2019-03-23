// import { isEqual } from 'lodash'
import { IFieldProps, IXFieldProps, xFieldMap as xFieldCoreMap } from './models'
import {
  IFormalizerOptions,
  IObjectValue,
  // IOnObjectValueChangeProps,
  IValueRefMap,
  IXFieldMap,
  IXFieldRefMap,
} from './types'
// import { valueRefMapToValue } from './utils'
import {
  // initValue,
  initXFieldDependencies,
  initXFieldMap,
  initXFieldObjectCapability,
  initXFieldRefMap,
  initXFields,
} from './utils/initialize'

export class Formalizer<ExtraProps = {}> {
  public config: IFormalizerOptions<ExtraProps> = {}

  public fields: IFieldProps[] = []

  public xFields: Array<IXFieldProps<ExtraProps>> = []
  public xFieldMap: IXFieldMap<ExtraProps> = {}
  public xFieldRefMap: IXFieldRefMap<ExtraProps> = {}

  public value: IObjectValue = {}
  public initialValue: IObjectValue = {}
  public valueRefMap: IValueRefMap = {}

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
    const xFields = (this.xFields = initXFields({
      fields,
      registerExtraProps,
      xFieldMap,
    }))

    // Initialize and create the flat dot notated object holding
    // all the xFields in the formalizer instance
    const xFieldRefMap = (this.xFieldRefMap = initXFieldRefMap<ExtraProps>(
      xFields
    ))

    // Enrich the xFields with dependency capabilities
    initXFieldDependencies<ExtraProps>(xFieldRefMap)

    // Enrich the xFields with valueType set to "object" with capabilities
    // to handle child properties up and down the tree
    initXFieldObjectCapability<ExtraProps>(xFieldRefMap)

    // Enrich the xFields with valueType set to "array" with capabilities
    // to handle child properties in the array fields
    // @TODO

    // Initialize and create the initialValue object in the formalizer instance
    // MOCK VALUE FROM OPTIONS AS DEFAULT - SHOULD BE EMPTY STRING
    // @TODO
    /*
    const { handleValueChange } = this

    const valueRefMap = initValue<ExtraProps>({
      initialValue: options.value,
      xFieldRefMap,
      onChange: handleValueChange,
      onDelete: handleValueChange,
    })

    // { myOtherField: 2, jsonField: {
      // jsonField2: { text2InJsonField2: 'bb' } } }

    const value = (this.value = valueRefMapToValue(valueRefMap))
    this.valueRefMap = valueRefMap
    this.initialValue = { ...value }
    */

    // Make sure each xField in xFieldRefMap keeps valueRefMap updated
  }

  // Keep value object updated, keep xValue object updated and
  // keep dirty, valid and touched updated
  /*
  private handleValueChange = ({ valueRefMap }: IOnObjectValueChangeProps) => {
    const value = valueRefMapToValue(valueRefMap)

    this.value = value

    if (!isEqual(value, this.initialValue)) {
      this.dirty = true
    }
  }
  */
}
