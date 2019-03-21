import deepmerge from 'deepmerge'
import { IFieldProps, IXFieldProps, xFieldMap as xFieldCoreMap } from './models'
import {
  IFormalizerOptions,
  IObjectValue,
  IValueRefMap,
  IXFieldMap,
  IXFieldRefMap,
} from './types'
import {
  initObjectXFields,
  initXFieldDependencies,
  initXFieldMap,
  initXFieldRefMap,
  initXFields,
} from './utils/initialize'

export class Formalizer<ExtraProps = {}> {
  public static xFieldCoreMap: IXFieldMap = xFieldCoreMap

  public static registerXFieldCoreMap = <E>(xFieldMap: IXFieldMap<E>) => {
    Formalizer.xFieldCoreMap = deepmerge(Formalizer.xFieldCoreMap, xFieldMap)
  }

  public config: IFormalizerOptions<ExtraProps> = {}

  public fields: IFieldProps[] = []
  public xFields: Array<IXFieldProps<ExtraProps>> = []
  public xFieldMap: IXFieldMap<ExtraProps> = {}
  public xFieldRefMap: IXFieldRefMap<ExtraProps> = {}

  public values: IObjectValue = {}
  public valuesRefMap: IValueRefMap = {}

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
      xFieldCoreMap: Formalizer.xFieldCoreMap,
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
    const xFieldRefMap = (this.xFieldRefMap = initXFieldRefMap(xFields))

    // Enrich the xFields with dependency capabilities
    initXFieldDependencies(xFieldRefMap)

    // Enrich the xFields with valueType set to "object" with capabilities
    // to handle child properties up and down the tree
    initObjectXFields(xFieldRefMap)

    // Enrich the xFields with valueType set to "array" with capabilities
    // to handle child properties in the array fields
    // @TODO

    // Initialize and create the initialValue object in the formalizer instance
  }
}
