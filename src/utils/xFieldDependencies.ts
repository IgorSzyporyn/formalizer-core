import { XFieldProps } from '../models'
import { XFieldRefMap } from '../types'

export function enhanceXFieldWithDependencies<ExtraProps>(
  xField: XFieldProps<ExtraProps>,
  refMap: XFieldRefMap<ExtraProps>
) {
  xField.dependencies!.forEach(dependency => {
    const depXField = refMap[dependency.name]
    depXField.addListener &&
      depXField.addListener(field => {
        console.log(field)
      })
  })

  return xField
}
