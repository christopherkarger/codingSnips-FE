import { ISnip } from "./snips";

export interface ISnipsCollection {
  _id: string;
  title: string;
  snipsCount: number; 
  snips?: ISnip[];
}

export type SnipsCollectionByIdQuery = {
  snipsCollectionById: ISnipsCollection;
};

export type AllSnipsCollectionsQuery = {
  snipsCollections: ISnipsCollection[];
};

export type UpdateSnipsCollectionNameMutation = {
  updateSnipsCollectionName: ISnipsCollection;
};

export type CreateSnipsCollectionMutation = {
  createSnipsCollection: ISnipsCollection;
};

export type DeleteSnipsCollectionMutation = {
  deleteSnipsCollection: ISnipsCollection;
};
