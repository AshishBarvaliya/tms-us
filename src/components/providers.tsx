"use client";

import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/lib/graphql-client";
import { MockAuthProvider } from "@/contexts/mock-auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockAuthProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </MockAuthProvider>
  );
}
