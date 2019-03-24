import { isEqual } from 'lodash'
import { IXFieldProps } from '../models'
import { IFieldDependency, IXFieldRefMap, SafeXFieldKeys } from '../types'

export interface IDependencyXFieldProps<E> extends IXFieldProps<E> {
  [key: string]: any
}

function invokeDependency<E>(
  xField: IDependencyXFieldProps<E>,
  dependency: IFieldDependency,
  propName: SafeXFieldKeys,
  value: any
) {
  const {
    failureValue,
    matchAllOf,
    matchAnyOf,
    matchNoneOf,
    matchProp,
    matchValue,
    successValue,
    targetProp,
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
}

export function enhanceXFieldWithDependencies<ExtraProps>(
  xField: IDependencyXFieldProps<ExtraProps>,
  refMap: IXFieldRefMap<ExtraProps>
) {
  xField.dependencies!.forEach(dependency => {
    const depXField = refMap[dependency.name]

    if (depXField.addListener) {
      depXField.addListener(({ propName, value }) => {
        invokeDependency(xField, dependency, propName, value)
      })

      if (!dependency.preventInitOnLoad) {
        invokeDependency(
          xField,
          dependency,
          dependency.matchProp,
          depXField[dependency.matchProp]
        )
      }
    }
  })

  return xField
}
