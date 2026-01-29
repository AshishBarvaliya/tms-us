import { gql } from "graphql-tag";

export const GET_SHIPMENTS_QUERY = gql`
  query GetShipmentsQuery($filter: ShipmentFilter, $sort: ShipmentSort) {
    getShipmentsQuery(filter: $filter, sort: $sort) {
      id
      shipperName
      carrierName
      status
      createdAt
      updatedAt
      estimatedDelivery
      pickupLocation {
        street
        city
        state
        postalCode
        country
      }
      deliveryLocation {
        street
        city
        state
        postalCode
        country
      }
      trackingData {
        status
        lastUpdated
        events {
          timestamp
          status
          location
          description
        }
      }
      rates {
        amount
        currency
        tax
        total
      }
    }
  }
`;

export const GET_SHIPMENT_BY_ID_QUERY = gql`
  query GetShipmentByIdQuery($id: ID!) {
    getShipmentByIdQuery(id: $id) {
      id
      shipperName
      carrierName
      status
      createdAt
      updatedAt
      estimatedDelivery
      pickupLocation {
        street
        city
        state
        postalCode
        country
      }
      deliveryLocation {
        street
        city
        state
        postalCode
        country
      }
      trackingData {
        status
        lastUpdated
        events {
          timestamp
          status
          location
          description
        }
      }
      rates {
        amount
        currency
        tax
        total
      }
    }
  }
`;

export const GET_SHIPMENTS_PAGINATED_QUERY = gql`
  query GetShipmentsPaginatedQuery(
    $filter: ShipmentFilter
    $sort: ShipmentSort
    $pagination: PaginationInput
  ) {
    getShipmentsPaginatedQuery(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          id
          shipperName
          carrierName
          status
          createdAt
        }
        cursor
      }
      pageInfo {
        page
        limit
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const ADD_SHIPMENT_MUTATION = gql`
  mutation AddShipmentMutation($input: ShipmentCreateInput!) {
    addShipmentMutation(input: $input) {
      id
      shipperName
      carrierName
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SHIPMENT_MUTATION = gql`
  mutation UpdateShipmentMutation($id: ID!, $input: ShipmentUpdateInput!) {
    updateShipmentMutation(id: $id, input: $input) {
      id
      shipperName
      carrierName
      status
      updatedAt
    }
  }
`;
