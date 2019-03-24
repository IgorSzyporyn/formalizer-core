import { isEqual, isString } from 'lodash'
import {
  IFieldDependency,
  IXFieldProps,
  IXFieldRefMap,
  SafeXFieldKeys,
} from '../types'

function processTpl<E>(input: any, xFieldRefMap: IXFieldRefMap<E>) {
  let output = input

  if (isString(input)) {
    const invoker = input.substr(0, 1)

    if (invoker === '$') {
      let path = input.substr(1)

      const propName: any = path.split('.').pop()
      path = path.replace(`.${propName}`, '')

      const matchField = xFieldRefMap[path]

      if (matchField && propName) {
        output = matchField[propName as SafeXFieldKeys<E>]
      }
    }
  }

  return output
}

export interface IDependencyXFieldProps<E> extends IXFieldProps<E> {
  [key: string]: any
}

function invokeDependency<E>(
  xField: IDependencyXFieldProps<E>,
  dependency: IFieldDependency,
  propName: SafeXFieldKeys,
  value: any,
  xFieldRefMap: IXFieldRefMap<E>
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

    xField[targetProp] = success
      ? processTpl<E>(successValue, xFieldRefMap)
      : processTpl<E>(failureValue, xFieldRefMap)
  }
}

export function enhanceXFieldWithDependencies<ExtraProps>(
  xField: IDependencyXFieldProps<ExtraProps>,
  xFieldRefMap: IXFieldRefMap<ExtraProps>
) {
  xField.dependencies!.forEach(dependency => {
    const depXField = xFieldRefMap[dependency.name]

    if (depXField.addListener) {
      depXField.addListener(({ propName, value }) => {
        invokeDependency(xField, dependency, propName, value, xFieldRefMap)
      })

      if (!dependency.preventInitOnLoad) {
        invokeDependency(
          xField,
          dependency,
          dependency.matchProp,
          depXField[dependency.matchProp],
          xFieldRefMap
        )
      }
    }
  })

  return xField
}
