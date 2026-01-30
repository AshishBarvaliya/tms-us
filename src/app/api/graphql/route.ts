import type { NextRequest } from "next/server";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { schema, seedDemoShipments } from "@/graphql/schema";
import type { GraphQLContext } from "@/graphql/context";

seedDemoShipments();

const server = new ApolloServer({ schema });
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest): Promise<GraphQLContext> => {
    const raw = req.headers.get("x-mock-role");
    const role = raw === "admin" ? "admin" : "employee";
    return {
      user: { id: "mock", role },
      role,
    };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
