import { client } from "@/lib/graphql-client";
import {
  GET_SHIPMENTS_QUERY,
  GET_SHIPMENTS_PAGINATED_QUERY,
  GET_SHIPMENT_BY_ID_QUERY,
  ADD_SHIPMENT_MUTATION,
  UPDATE_SHIPMENT_MUTATION,
} from "./operations";
import type {
  ShipmentFilter,
  ShipmentSort,
  PaginationInput,
} from "./utils";
import type { ShipmentCreateInput, ShipmentUpdateInput } from "./types";

type ShipmentsListData = { getShipmentsQuery?: unknown };
type ShipmentsPaginatedData = { getShipmentsPaginatedQuery?: unknown };
type ShipmentByIdData = { getShipmentByIdQuery?: unknown };
type AddShipmentData = { addShipmentMutation?: unknown };
type UpdateShipmentData = { updateShipmentMutation?: unknown };

export async function GetShipmentsListAction(
  filter?: ShipmentFilter | null,
  sort?: ShipmentSort | null
) {
  const response = await client.query<ShipmentsListData>({
    query: GET_SHIPMENTS_QUERY,
    variables: { filter: filter ?? undefined, sort: sort ?? undefined },
    fetchPolicy: "network-only",
  });
  return response?.data?.getShipmentsQuery;
}

export async function GetShipmentsAction(
  page?: number,
  limit?: number,
  filter?: ShipmentFilter | null,
  sort?: ShipmentSort | null
) {
  const pagination: PaginationInput | undefined =
    page != null || limit != null ? { page: page ?? 1, limit: limit ?? 10 } : undefined;
  const response = await client.query<ShipmentsPaginatedData>({
    query: GET_SHIPMENTS_PAGINATED_QUERY,
    variables: { filter: filter ?? undefined, sort: sort ?? undefined, pagination },
    fetchPolicy: "network-only",
  });
  return response?.data?.getShipmentsPaginatedQuery;
}

export async function GetShipmentByIdAction(id: string) {
  const response = await client.query<ShipmentByIdData>({
    query: GET_SHIPMENT_BY_ID_QUERY,
    variables: { id },
    fetchPolicy: "network-only",
  });
  return response?.data?.getShipmentByIdQuery;
}

export async function AddShipmentAction(input: ShipmentCreateInput) {
  const response = await client.mutate<AddShipmentData>({
    mutation: ADD_SHIPMENT_MUTATION,
    variables: { input },
  });
  return response?.data?.addShipmentMutation;
}

export async function UpdateShipmentAction(id: string, input: ShipmentUpdateInput) {
  const response = await client.mutate<UpdateShipmentData>({
    mutation: UPDATE_SHIPMENT_MUTATION,
    variables: { id, input },
  });
  return response?.data?.updateShipmentMutation;
}
