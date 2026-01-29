import { GraphQLSchema, GraphQLObjectType } from "graphql";
import queries from "./shipments/queries";
import mutations from "./shipments/mutations";

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: queries,
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: mutations,
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export { seedDemoShipments } from "@/db/shipments-seed";
