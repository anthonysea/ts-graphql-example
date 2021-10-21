import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
require("dotenv").config();
// import "dotenv/config";

import { redis } from "./redis";

// Constants
import { COOKIE_NAME, __prod__ } from "./constants";
const SESSION_SECRET = process.env.SESSION_SECRET!;

const main = async () => {
  // Connection to postgresql db, config defined in ormconfig.json
  await createConnection();

  // TypeGraphQL schema, pass in resolvers that we are going to use
  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"], // Automatically discover any resolvers in the modules directory
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });

  // Create apollo server using our TypeGraphQL schema
  const apolloServer = new ApolloServer({
    schema,
    // Apollo server gives us access to the context object
    // which can then be passed the request object which comes from Express
    // and can now be accessed in our resolvers
    context: ({ req, res }) => ({ req, res}),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  // Enable CORS on Express
  app.use(
    cors({
      credentials: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:4000/graphql",
        "https://studio.apollographql.com",
      ], // Accept requests coming from localhost:3000 where we are expecting the frontend to run
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "none", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      resave: false,
      secret: SESSION_SECRET,
    })
  );

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main();
