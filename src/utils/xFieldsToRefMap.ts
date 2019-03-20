import { XFieldProps } from '../models'
import { XFieldRefMap } from '../types'
import { errorMsg } from './messages'

export const xFieldsToRefMap = <ExtraProps>(
  xFields: XFieldProps<ExtraProps>[],
  refMap: XFieldRefMap<ExtraProps> = {}
) => {
  let xFieldRefMap = { ...refMap }

  xFields.forEach(xField => {
    if (xFieldRefMap[xField.$id!]) {
      errorMsg(`Found duplicate key for ${xField.$id!}`)
    }

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
