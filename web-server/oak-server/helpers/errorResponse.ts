import { Context } from "https://deno.land/x/oak/context.ts";

export const errorBadResponse = (context: Context, message: string, error: boolean) => {
  context.response.status = 400;
  context.response.body = {
    'error': error,
    'message': message
  }
  return context;
}

export const errorInternalServer = (context: Context) => {
  context.response.status = 500;
  context.response.body = {
    'error': true,
    'message': 'Internal Server error occured, please check logs'
  }
  return context;
}