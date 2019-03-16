import { XFieldProps } from '../models'
import { XFieldsRefMap } from '../types'

export function enhanceXFieldWithDependencies<ExtraProps>(
  xField: XFieldProps<ExtraProps>,
  refMap: XFieldsRefMap<ExtraProps>
) {
  xField.dependencies!.forEach(dependency => {
    const depXField = refMap[dependency.name]
    depXField.addListener && depXField.addListener(field => {})
  })

  return xField
}
