import { createConnection } from "typeorm";
require("dotenv").config();

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "ts-graphql-example-test",
    synchronize: drop,
    logging: drop,
    entities: [__dirname + "/../entity/*.*"],
  });
};
