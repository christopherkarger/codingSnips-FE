import gql from "graphql-tag";

export const createSnipMutation = gql`
  mutation createSnip($collectionId: String!, $text: String!, $title: String!) {
    createSnip(
      snipInput: { collectionId: $collectionId, title: $title, text: $text }
    ) {
      _id
      title
      text
    }
  }
`;

export const snipsFromCollectionQuery = gql`
  query snipsFromCollection($collectionId: String!) {
    snipsFromCollection(collectionId: $collectionId) {
      _id
      title
    }
  }
`;

export const snipDetailsQuery = gql`
  query snipDetails($snipId: String!) {
    snipDetails(snipId: $snipId) {
      _id
      title
      text
    }
  }
`;

export const updateSnipMutation = gql`
  mutation updateSnip($snipId: String!, $text: String!, $title: String!) {
    updateSnip(snipInput: { snipId: $snipId, title: $title, text: $text }) {
      _id
      text
      title
    }
  }
`;
