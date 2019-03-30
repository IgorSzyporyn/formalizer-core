import { cloneDeep, isEmpty } from 'lodash'
import {
  IFormalizerOptions,
  IValidationErrors,
  IValue,
  IXFieldMap,
  IXFieldProps,
  IXFieldRefMap,
  ValidateFn,
} from './types'
import { initXFieldValidation, mapEach } from './utils'
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

  public xFields: Array<IXFieldProps<ExtraProps>> = []
  public xFieldMap: IXFieldMap<ExtraProps> = {}
  public xFieldRefMap: IXFieldRefMap<ExtraProps> = {}

  public value: IValue = {}
  public initialValue: IValue = {}

  public validate: ValidateFn
  public validation: IValidationErrors = {}

  public dirty: boolean = false
  public touched: boolean = false
  public valid: boolean = false

  protected formalizer = '1.0.0'

  constructor(options: IFormalizerOptions<ExtraProps> = {}) {
    const { registerExtraProps, fields = [] } = options
    const config = (this.config = options)

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

    // And handle validation
    this.validate = initXFieldValidation(this.xFields)
  }

  // Keep value object updated, keep xValue object updated and
  // keep dirty, valid and touched updated
  private handleValueChange = () => {
    const { onDirtyChange, onTouchedChange } = this.config
    const dirty =
      JSON.stringify(this.value) !== JSON.stringify(this.initialValue)
    const dirtyChange = dirty !== this.dirty

    this.dirty = dirty

    if (!this.touched && onTouchedChange) {
      onTouchedChange(true)
    }

    if (this.dirty) {
      this.touched = true
    }

    if (dirtyChange && onDirtyChange) {
      onDirtyChange(dirty)
    }

    this.handleValidation()
  }

  private handleValidation = async () => {
    const { onValidChange } = this.config
    const validation = (this.validation = await this.validate(this.value))
    const valid = isEmpty(validation)
    const validChange = valid !== this.valid

    this.valid = valid

    if (validChange && onValidChange) {
      onValidChange(valid)
    }

    mapEach<IXFieldRefMap, IXFieldProps>(this.xFieldRefMap, xField => {
      const error = validation[xField.$id!]
      xField.error = error || undefined
    })
  }
}
