import { IXFieldProps, IXFieldRefMap } from '../types'
import { errorMsg } from './messages'

export const xFieldsToRefMap = <ExtraProps>(
  xFields: Array<IXFieldProps<ExtraProps>>,
  refMap: IXFieldRefMap<ExtraProps> = {}
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
