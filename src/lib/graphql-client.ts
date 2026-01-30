import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { config } from "@/config";
import { getStoredMockRole } from "@/lib/mock-auth";

const {
  graphql: { endpoint: GRAPHQL_ENDPOINT },
} = config;

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "x-mock-role": getStoredMockRole(),
  },
}));

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  fetchOptions: {
    cache: "no-store",
  },
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  },
});
