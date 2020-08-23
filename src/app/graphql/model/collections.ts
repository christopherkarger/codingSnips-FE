export interface ISnipCollection {
  _id: string;
  title: string;
  snips?: any[];
}

export type SnipsCollectionByIdQuery = {
  snipsCollectionById: ISnipCollection;
};

export type AllSnipsCollectionsQuery = {
  snipsCollections: ISnipCollection[];
};

export type UpdateSnipsCollectionNameMutation = {
  updateSnipsCollectionName: ISnipCollection;
};

export type CreateSnipsCollectionMutation = {
  createSnipsCollection: ISnipCollection;
};

export type DeleteSnipsCollectionMutation = {
  deleteSnipsCollection: ISnipCollection;
};
