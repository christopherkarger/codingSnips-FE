import gql from "graphql-tag";

export const createSnipMutation = gql`
  mutation createSnip(
    $collectionId: String!
    $text: String!
    $title: String!
    $language: String!
  ) {
    createSnip(
      snipInput: {
        collectionId: $collectionId
        title: $title
        text: $text
        language: $language
      }
    ) {
      _id
      title
      text
      language
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
      language
    }
  }
`;

export const updateSnipMutation = gql`
  mutation updateSnip(
    $snipId: String!
    $text: String!
    $title: String!
    $language: String!
  ) {
    updateSnip(
      snipInput: {
        snipId: $snipId
        title: $title
        text: $text
        language: $language
      }
    ) {
      _id
      text
      title
      language
    }
  }
`;

export const deleteSnipMutation = gql`
  mutation deleteSnip($snipId: String!) {
    deleteSnip(snipId: $snipId) {
      _id
      text
      title
      language
      snipsCollection {
        _id
      }
    }
  }
`;
