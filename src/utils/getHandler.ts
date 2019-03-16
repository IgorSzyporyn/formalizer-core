import { OnXFieldChange, SafeXFieldKeys } from '../types'
import { XFieldProps } from '../models'

export function getHandler<U>(onChange?: OnXFieldChange<U>) {
  return {
    set(xField: XFieldProps<U>, propName: SafeXFieldKeys<U>, value: any) {
      xField[propName] = value
      onChange && onChange({ propName, value, xField })

      return true
    },
  }
}
