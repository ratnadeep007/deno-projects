import Drash from "https://deno.land/x/drash@v0.37.1/mod.ts";
import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";
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
      this.response.body = {
        'name': user[0],
        'email': user[1],
        'password': user[2]
      }
      return this.response;
    } catch(e) {
      console.log(e);
    }
  }
}