import { GraphQLNonNull, GraphQLID } from "graphql";
import type { GraphQLContext } from "@/graphql/context";
import { Shipment, ShipmentCreateInput, ShipmentUpdateInput } from "./graphqlTypes";
import { addShipment, updateShipment } from "./services";
import type {
  ShipmentCreateInput as CreateInput,
  ShipmentUpdateInput as UpdateInput,
} from "./types";

export const addShipmentMutation = () => ({
  type: new GraphQLNonNull(Shipment),
  args: {
    input: { type: new GraphQLNonNull(ShipmentCreateInput) },
  },
  async resolve(
    _: unknown,
    { input }: { input: CreateInput },
    context: GraphQLContext
  ) {
    if (!context.user) throw new Error("Unauthenticated");
    return addShipment(input);
  },
});

export const updateShipmentMutation = () => ({
  type: Shipment,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    input: { type: new GraphQLNonNull(ShipmentUpdateInput) },
  },
  async resolve(
    _: unknown,
    { id, input }: { id: string; input: UpdateInput },
    context: GraphQLContext
  ) {
    if (!context.user) throw new Error("Unauthenticated");
    if (context.role !== "admin") {
      throw new Error("Forbidden: only admins can update shipments");
    }
    return updateShipment(id, input);
  },
});

const mutations = {
  addShipmentMutation: addShipmentMutation(),
  updateShipmentMutation: updateShipmentMutation(),
};

export default mutations;
