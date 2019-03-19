import { warningMsg } from './messages'

export const xFieldErrorMessage = (key: string, message: string) => {
  warningMsg(
    `Could not register the xField type <${key}> in the field map ${message}`
  )
}
