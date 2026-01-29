import { GraphQLList, GraphQLNonNull, GraphQLID } from "graphql";
import {
  Shipment,
  ShipmentConnection,
  ShipmentFilterInput,
  ShipmentSortInput,
  PaginationInput,
} from "./graphqlTypes";
import {
  getShipmentById,
  listShipments,
  listShipmentsPaginated,
} from "./services";
import type {
  ShipmentFilter,
  ShipmentSort,
  PaginationInput as Paging,
} from "./utils";

export const getShipmentsQuery = () => ({
  type: new GraphQLList(new GraphQLNonNull(Shipment)),
  args: {
    filter: { type: ShipmentFilterInput },
    sort: { type: ShipmentSortInput },
  },
  async resolve(
    _: unknown,
    args: { filter?: ShipmentFilter; sort?: ShipmentSort }
  ) {
    return listShipments(args.filter, args.sort);
  },
});

export const getShipmentByIdQuery = () => ({
  type: Shipment,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: unknown, args: { id: string }) {
    return getShipmentById(args.id);
  },
});

export const getShipmentsPaginatedQuery = () => ({
  type: new GraphQLNonNull(ShipmentConnection),
  args: {
    filter: { type: ShipmentFilterInput },
    sort: { type: ShipmentSortInput },
    pagination: { type: PaginationInput },
  },
  async resolve(
    _: unknown,
    args: { filter?: ShipmentFilter; sort?: ShipmentSort; pagination?: Paging }
  ) {
    const result = listShipmentsPaginated(
      args.filter,
      args.sort,
      args.pagination
    );
    return { edges: result.edges, pageInfo: result.pageInfo };
  },
});

const queries = {
  getShipmentsQuery: getShipmentsQuery(),
  getShipmentByIdQuery: getShipmentByIdQuery(),
  getShipmentsPaginatedQuery: getShipmentsPaginatedQuery(),
};

export default queries;
