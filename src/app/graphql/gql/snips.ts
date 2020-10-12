import gql from "graphql-tag";

export const createSnipMutation = gql`
  mutation createSnip(
    $collectionId: String!
    $text: String!
    $title: String!
    $language: String!
    $favourite: Boolean!
  ) {
    createSnip(
      snipInput: {
        collectionId: $collectionId
        title: $title
        text: $text
        language: $language
        favourite: $favourite
      }
    ) {
      _id
      title
      text
      language
      favourite
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
      favourite
    }
  }
`;

export const updateSnipMutation = gql`
  mutation updateSnip(
    $snipId: String!
    $text: String!
    $title: String!
    $language: String!
    $favourite: Boolean!
  ) {
    updateSnip(
      snipInput: {
        snipId: $snipId
        title: $title
        text: $text
        language: $language
        favourite: $favourite
      }
    ) {
      _id
      text
      title
      language
      favourite
    }
  }
`;

export const updateSnipFavouriteMutation = gql`
  mutation updateSnipFavourite(
    $snipId: String!
    $favourite: Boolean!
  ) {
    updateSnipFavourite(
        snipId: $snipId,
        favourite: $favourite
    ) {
      _id
      favourite
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
      favourite
      snipsCollection {
        _id
      }
    }
  }
`;
