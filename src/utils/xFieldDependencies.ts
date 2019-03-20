import { XFieldProps } from '../models'
import { XFieldRefMap } from '../types'

export function enhanceXFieldWithDependencies<ExtraProps>(
  xField: XFieldProps<ExtraProps> & { [key: string]: any },
  refMap: XFieldRefMap<ExtraProps>
) {
  xField.dependencies!.forEach(dependency => {
    const depXField = refMap[dependency.name]
    depXField.addListener &&
      depXField.addListener(({ propName, value }) => {
        const {
          matchProp,
          matchValue,
          matchAllOf,
          matchAnyOf,
          matchNoneOf,
          targetProp,
          targetSuccesValue,
          targetFailureValue,
        } = dependency

        if (propName === matchProp) {
          if (matchValue !== undefined) {
            xField[targetProp] =
              matchValue === value ? targetSuccesValue : targetFailureValue
          } else if (matchAnyOf) {
            // Check for anyOf key - which means to match
            // value any value in dependency anyOf array
          }
        }
      })
  })

  return xField
}
