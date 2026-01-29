import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLEnumType,
} from "graphql";

export const SortDirectionEnum = new GraphQLEnumType({
  name: "SortDirection",
  values: {
    ASC: { value: "ASC" },
    DESC: { value: "DESC" },
  },
});

export const ShipmentSortFieldEnum = new GraphQLEnumType({
  name: "ShipmentSortField",
  values: {
    createdAt: { value: "createdAt" },
    updatedAt: { value: "updatedAt" },
    status: { value: "status" },
    shipperName: { value: "shipperName" },
    carrierName: { value: "carrierName" },
    estimatedDelivery: { value: "estimatedDelivery" },
  },
});

export const Address = new GraphQLObjectType({
  name: "Address",
  fields: {
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
  },
});

export const TrackingEvent = new GraphQLObjectType({
  name: "TrackingEvent",
  fields: {
    timestamp: { type: GraphQLString },
    status: { type: GraphQLString },
    location: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

export const TrackingData = new GraphQLObjectType({
  name: "TrackingData",
  fields: {
    status: { type: GraphQLString },
    lastUpdated: { type: GraphQLString },
    events: { type: new GraphQLList(TrackingEvent) },
  },
});

export const Rates = new GraphQLObjectType({
  name: "Rates",
  fields: {
    amount: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    tax: { type: GraphQLFloat },
    total: { type: GraphQLFloat },
  },
});

export const Shipment = new GraphQLObjectType({
  name: "Shipment",
  fields: {
    id: { type: GraphQLID },
    shipperName: { type: GraphQLString },
    carrierName: { type: GraphQLString },
    pickupLocation: { type: Address },
    deliveryLocation: { type: Address },
    trackingData: { type: TrackingData },
    rates: { type: Rates },
    status: { type: GraphQLString },
    estimatedDelivery: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const AddressInput = new GraphQLInputObjectType({
  name: "AddressInput",
  fields: {
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const TrackingEventInput = new GraphQLInputObjectType({
  name: "TrackingEventInput",
  fields: {
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

export const TrackingDataInput = new GraphQLInputObjectType({
  name: "TrackingDataInput",
  fields: {
    status: { type: new GraphQLNonNull(GraphQLString) },
    events: { type: new GraphQLList(TrackingEventInput) },
    lastUpdated: { type: GraphQLString },
  },
});

export const RatesInput = new GraphQLInputObjectType({
  name: "RatesInput",
  fields: {
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    currency: { type: new GraphQLNonNull(GraphQLString) },
    tax: { type: GraphQLFloat },
    total: { type: GraphQLFloat },
  },
});

export const ShipmentCreateInput = new GraphQLInputObjectType({
  name: "ShipmentCreateInput",
  fields: {
    shipperName: { type: new GraphQLNonNull(GraphQLString) },
    carrierName: { type: new GraphQLNonNull(GraphQLString) },
    pickupLocation: { type: new GraphQLNonNull(AddressInput) },
    deliveryLocation: { type: new GraphQLNonNull(AddressInput) },
    trackingData: { type: TrackingDataInput },
    rates: { type: new GraphQLNonNull(RatesInput) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    estimatedDelivery: { type: GraphQLString },
  },
});

export const ShipmentUpdateInput = new GraphQLInputObjectType({
  name: "ShipmentUpdateInput",
  fields: {
    shipperName: { type: GraphQLString },
    carrierName: { type: GraphQLString },
    pickupLocation: { type: AddressInput },
    deliveryLocation: { type: AddressInput },
    trackingData: { type: TrackingDataInput },
    rates: { type: RatesInput },
    status: { type: GraphQLString },
    estimatedDelivery: { type: GraphQLString },
  },
});

export const ShipmentSortInput = new GraphQLInputObjectType({
  name: "ShipmentSort",
  fields: {
    field: { type: new GraphQLNonNull(ShipmentSortFieldEnum) },
    direction: { type: SortDirectionEnum },
  },
});

export const ShipmentFilterInput = new GraphQLInputObjectType({
  name: "ShipmentFilter",
  fields: {
    shipperName: { type: GraphQLString },
    carrierName: { type: GraphQLString },
    status: { type: GraphQLString },
    createdAfter: { type: GraphQLString },
    createdBefore: { type: GraphQLString },
  },
});

export const PaginationInput = new GraphQLInputObjectType({
  name: "PaginationInput",
  fields: {
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
});

export const PageInfo = new GraphQLObjectType({
  name: "PageInfo",
  fields: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
    limit: { type: new GraphQLNonNull(GraphQLInt) },
    totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
    hasPreviousPage: { type: new GraphQLNonNull(GraphQLBoolean) },
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString },
  },
});

export const ShipmentEdge = new GraphQLObjectType({
  name: "ShipmentEdge",
  fields: {
    node: { type: new GraphQLNonNull(Shipment) },
    cursor: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const ShipmentConnection = new GraphQLObjectType({
  name: "ShipmentConnection",
  fields: {
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ShipmentEdge))) },
    pageInfo: { type: new GraphQLNonNull(PageInfo) },
  },
});
