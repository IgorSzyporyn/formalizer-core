import { XFieldProps } from '../models'
import { XFieldRefMap } from '../types'

export const xFieldsToRefMap = <ExtraProps>(
  xFields: XFieldProps<ExtraProps>[],
  refMap: XFieldRefMap<ExtraProps> = {}
) => {
  let xFieldRefMap = { ...refMap }

  xFields.forEach(xField => {
    xFieldRefMap[xField.$id!] = xField

    if (xField.fields) {
      const childRefMap = xFieldsToRefMap(xField.fields, xFieldRefMap)

      xFieldRefMap = {
        ...xFieldRefMap,
        ...childRefMap,
      }
    }
  })

  return xFieldRefMap
}
