export function errorMsg(message: string) {
  // tslint:disable-next-line no-console
  console.error(`@formalizer/core: ${message}`)
}

export function warningMsg(message: string) {
  // tslint:disable-next-line no-console
  console.warn(`@formalizer/core: ${message}`)
}
