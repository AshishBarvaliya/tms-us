function getGraphQLEndpoint(): string {
  if (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    return process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/graphql`;
  }
  return "http://localhost:3000/api/graphql";
}

export const config = {
  graphql: {
    endpoint: getGraphQLEndpoint(),
  },
};
