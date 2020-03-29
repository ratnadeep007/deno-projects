import Drash from "https://deno.land/x/drash@v0.37.1/mod.ts";
import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";
import { denoPostgres } from '../index.ts';

export default class AuthResource extends Drash.Http.Resource {
  static paths = ["/auth"];
  public async POST() {
    try {
      await denoPostgres.connect();
      const username = this.request.getBodyParam("username");
      const password = this.request.getBodyParam("password");
      if (!username || !password) {
        this.request.body = {
          'error': true,
          'message': 'All fields are required'
        }
        this.response.status_code = 400;
        return this.response;
      }
      const query = `
        SELECT * FROM users WHERE username = '${username}'
      `;
      const result = await denoPostgres.query(query);
      if (!result.rows.length) {
        this.request.body = {
          'error': false,
          'message': 'No user present with given username'
        }
        this.response.status_code = 400;
        return this.response;
      }
      const user = result.rows[0];
      const encryptedPassword = new Hash("sha1").digest(encode(password)).hex().toString();
      if (user[3] != encryptedPassword) {
        this.response.body = {
          'error': false,
          'message': 'Password is wrong'
        }
        this.response.status_code = 400;
        return this.response;
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