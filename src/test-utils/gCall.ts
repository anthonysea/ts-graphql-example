import { graphql } from "graphql";
import { createSchema } from "../utils/createSchema";

interface Options {
  source: string;
  variableValues?: any;
  userId?: number;
}

export const gCall = async ({ source, variableValues, userId }: Options) => {
  return graphql({
    schema: await createSchema(),
    source,
    variableValues,
    // Can pass in context values that are resolvers expect which give access to the req and res object
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {},
    },
  });
};
