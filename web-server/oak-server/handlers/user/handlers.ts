import { Context } from "https://deno.land/x/oak/mod.ts";
import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";
import { denoPostgres } from "../../index.ts";
import { errorBadResponse, errorInternalServer } from '../../helpers/errorResponse.ts';

export const getUsers = async (context: Context) => {
  try {
    await denoPostgres.connect();
    let users = await denoPostgres.query("SELECT * from users");
    let returnObj = [];
    for (let i = 0; i < users.rows.length; i++) {
      const data = users.rows[i];
      let d: any = {};
      d['name'] = data[0];
      d['email'] = data[1];
      d['username'] = data[2];
      returnObj.push(d);
    }
    context.response.body = returnObj;
  } catch(e) {
    console.log(e);
    context = errorInternalServer(context);
  }
}

export const addUser = async (context: Context) => {
  try {
    await denoPostgres.connect();
    if (context.request.hasBody) {
      const data = await context.request.body();
      const body = data.value;
      if (!body['username'] || !body['password'] || !body['name'] || !body['email']) {
        context = errorBadResponse(context, 'All fields are required', true);
      }
      const encryptedPassword = new Hash("sha1").digest(encode(body['password'])).hex().toString();
      await denoPostgres.query(`INSERT INTO users VALUES ('${body['name']}', '${body['email']}', '${body['username']}', '${encryptedPassword}')`);

      context.response.body = {
        'name': body['name'],
        'email': body['email'],
        'username': body['username']
      }
    } else {
      context = errorBadResponse(context, 'All fields are required', true);
    }
  } catch(e) {
    console.log(e);
    if (e['fields'] && e['fields']['message'] && e['fields']['detail']) {
      context = errorBadResponse(context, e['fields']['message'] + ', ' + e['fields']['detail'], true);
    } else {
      context = errorInternalServer(context);
    }
  }
}