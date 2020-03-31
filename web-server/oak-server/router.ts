// This is main router

import { RouteParams, Router } from "https://deno.land/x/oak/mod.ts";

import { getUsers, addUser } from './handlers/user/handlers.ts';

const router = new Router();

router.get('/user', context => getUsers(context))
  .post('/user', context => addUser(context));

export default router;