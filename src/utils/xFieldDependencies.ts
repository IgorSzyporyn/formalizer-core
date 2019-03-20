import { XFieldProps } from '../models'
import { XFieldRefMap } from '../types'
import { isEqual } from 'lodash'

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
          successValue,
          failureValue,
        } = dependency

        if (propName === matchProp) {
          let success = false

          if (matchValue !== undefined) {
            success = isEqual(matchValue, value)
          } else if (matchAnyOf && value && value.includes) {
            success = matchAnyOf.some(item => value.includes(item))
          } else if (matchAllOf && value && value.includes) {
            let count = 0

            matchAllOf.forEach(item => {
              count = value.includes(item) ? count + 1 : count
            })

            success = count === matchAllOf.length
          } else if (matchNoneOf) {
            if (value && value.includes) {
              success = matchNoneOf.every(item => !value.includes(item))
            } else {
              success = true
            }
          }

          xField[targetProp] = success ? successValue : failureValue
        }
      })
  })

  return xField
}
