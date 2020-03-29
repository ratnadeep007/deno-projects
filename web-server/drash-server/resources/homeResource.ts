import Drash from "https://deno.land/x/drash@v0.37.1/mod.ts";

export default class HomeResource extends Drash.Http.Resource {
  static paths = ["/"];
  public GET() {
    this.response.body = "Hello World!";
    return this.response;
  }
}