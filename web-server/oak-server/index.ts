import { Application } from "https://deno.land/x/oak/mod.ts";
import router from './router.ts';

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


// DB realted
import { Client } from "https://deno.land/x/postgres/mod.ts";
const denoPostgres = new Client({
  database: "deno_postgres",
  host: "localhost",
  port: "5432",
  user: "postgres", // specify your db user
  password: "postgres"
});
const createTables = async () => {
console.log("Creating table User");
await denoPostgres.connect();
try {
  let userExists = await denoPostgres.query("SELECT table_catalog, table_schema FROM information_schema.tables WHERE table_name = 'users'");
  if (userExists.rows.length < 1) {
    let userTableQuery = `
      CREATE TABLE users(
        NAME VARCHAR (50) NOT NULL,
        EMAIL VARCHAR (50) NOT NULL,
        USERNAME VARCHAR (50) NOT NULL,
        PASSWORD VARCHAR (256) NOT NULL,
        PRIMARY KEY (USERNAME)
    );
    `;
    let userTable = await denoPostgres.query(userTableQuery);
    console.log('User table created');
  }
  await denoPostgres.end();
  } catch(e) {
    console.log(e);
  }
}

createTables();

export {
  denoPostgres
}


await app.listen({  port: 8000 });