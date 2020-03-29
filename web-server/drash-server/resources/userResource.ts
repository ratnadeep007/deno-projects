import Drash from "https://deno.land/x/drash@v0.37.1/mod.ts";
import { Hash, encode } from "https://deno.land/x/checksum/mod.ts";
import { denoPostgres } from '../index.ts';
import { errorBadResponse } from '../helpers/errorResponse.ts';

export default class UserResource extends Drash.Http.Resource {
  static paths = ["/user"];
  public async GET() {
    try {
      await denoPostgres.connect();
      let users = await denoPostgres.query(`SELECT * FROM users`);
      let returnObject: any = [];
      for(let i = 0; i < users.rows.length; i++) {
        const data = users.rows[i];
        let d: any = {};
        d['name'] = data[0]; 
        d['email'] = data[1];
        d['username'] = data[2];
        returnObject.push(d);
      }
      this.response.body = returnObject;
    } catch(e) {
      console.log(e);
    }
    return this.response;
  }
  public async POST() {
    const name = this.request.getBodyParam("name");
    const email = this.request.getBodyParam("email");
    const username = this.request.getBodyParam("username");
    const password = this.request.getBodyParam("password");
    if (!name || !email || !username || !password) {
      return errorBadResponse(this.response, 'All fields are required', true);
    } 
    const encryptedPassword = new Hash("sha1").digest(encode(password)).hex().toString();
    await denoPostgres.connect();
    await denoPostgres.query(`INSERT INTO users VALUES ('${name}', '${email}', '${username}', '${encryptedPassword}')`);
    this.response.body = { name, email, username };
    return this.response;
  }
}