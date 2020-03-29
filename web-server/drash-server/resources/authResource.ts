import Drash from "https://deno.land/x/drash@v0.37.1/mod.ts";
import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";
import validateJwt from "https://deno.land/x/djwt/validate.ts"
import makeJwt, {
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts"

const key = "supersecret"
import { denoPostgres } from '../index.ts';
import { errorBadResponse } from '../helpers/errorResponse.ts';

export default class AuthResource extends Drash.Http.Resource {
  static paths = ["/auth"];
  public async POST() {
    try {
      await denoPostgres.connect();
      const username = this.request.getBodyParam("username");
      const password = this.request.getBodyParam("password");
      if (!username || !password) {
        return errorBadResponse(this.response, 'All fields are required', true);
      }
      const query = `
        SELECT * FROM users WHERE username = '${username}'
      `;
      const result = await denoPostgres.query(query);
      if (!result.rows.length) {
        return errorBadResponse(this.response, 'No user present with given username', false);
      }
      const user = result.rows[0];
      const encryptedPassword = new Hash("sha1").digest(encode(password)).hex().toString();
      if (user[3] != encryptedPassword) {
        return errorBadResponse(this.response, 'Password is wrong', false);
      }
      const header: Jose = {
        alg: "HS256",
        typ: "JWT"
      }
      const payload: Payload = {
        'name': user[0],
        'email': user[1],
        'username': user[2]
      }
      const jwt = makeJwt({ header, payload }, key);
      this.response.body = {
        ...payload,
        "token": jwt
      }
      return this.response;
    } catch(e) {
      console.log(e);
    }
  }
}