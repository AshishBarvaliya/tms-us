import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { config } from "@/config";

const {
  graphql: { endpoint: GRAPHQL_ENDPOINT },
} = config;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    fetchOptions: {
      cache: "no-store",
    },
  }),
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  },
});
