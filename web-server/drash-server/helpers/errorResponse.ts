export function errorBadResponse(responseObject: any, message: string, error: boolean) {
  responseObject.body = {
    "error": error,
    "message": message
  }
  responseObject.status_code = 400;
  return responseObject;
}