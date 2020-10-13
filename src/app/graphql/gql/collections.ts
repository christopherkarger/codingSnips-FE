import gql from "graphql-tag";

export const snipsCollectionByIdQuery = gql`
  query snipsCollectionById($collectionId: String!) {
    snipsCollectionById(collectionId: $collectionId) {
      _id
      title
      snips {
        title
      }
    }
  }
`;

export const allSnipsCollectionsQuery = gql`
  query allSnipsCollections {
    snipsCollections {
      _id
      title
      snipsCount
    }
  }
`;

export const updateSnipsCollectionNameMutation = gql`
  mutation updateSnipsCollectionName($collectionId: String!, $title: String!) {
    updateSnipsCollectionName(collectionId: $collectionId, title: $title) {
      _id
      title
    }
  }
`;

export const createSnipsCollectionMutation = gql`
  mutation createSnipsCollection($title: String!) {
    createSnipsCollection(title: $title) {
      _id
      title
    }
  }
`;

export const deleteSnipsCollectionMutation = gql`
  mutation deleteSnipsCollection($collectionId: String!) {
    deleteSnipsCollection(collectionId: $collectionId) {
      _id
      title
    }
  }
`;

export const favouritesInfoQuery = gql`
  query favouriteInfoSnips {
    favouriteSnips {
      snipsCount
    }
  }
`;

export const favouritesQuery = gql`
  query favouriteSnips {
    favouriteSnips {
      snips {
        _id
        title
      }
    }
  }
`;
