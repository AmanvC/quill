export type TActionResponse = TSuccess | TFailure

export type TSuccess = {
  success: true,
  message: string
}

export type TFailure = {
  success: false,
  errorType: TErrorTypes,
  message: string
}

export type TErrorTypes = 
  | "INVALID_DATA"
  | "NOT_REGISTERED"
  | "NOT_VERIFIED"
  | "CREDENTIALS_ERROR"
  | "DEFAULT"