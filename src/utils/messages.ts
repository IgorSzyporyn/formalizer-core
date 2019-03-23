export function errorMsg(message: string) {
  if (process.env.NODE_ENV === 'development') {
    // tslint:disable-next-line no-console
    console.error(`@formalizer/core: ${message}`)
  }
}

export function warningMsg(message: string) {
  if (process.env.NODE_ENV === 'development') {
    // tslint:disable-next-line no-console
    console.warn(`@formalizer/core: ${message}`)
  }
}
