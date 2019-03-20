import { isEqual } from 'lodash'
import { XFieldProps } from '../models'
import { IXFieldRefMap } from '../types'

export function enhanceXFieldWithDependencies<ExtraProps>(
  xField: XFieldProps<ExtraProps> & { [key: string]: any },
  refMap: IXFieldRefMap<ExtraProps>
) {
  xField.dependencies!.forEach(dependency => {
    const depXField = refMap[dependency.name]

    if (depXField.addListener) {
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
            success =
              value && value.includes
                ? matchNoneOf.every(item => !value.includes(item))
                : true
          }

          xField[targetProp] = success ? successValue : failureValue
        }
      })
    }
  })

  return xField
}
