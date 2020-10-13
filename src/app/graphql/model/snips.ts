import { SnipsCollection } from "../../pages/collection-details/models/snipscollection";

export interface ISnip {
  _id: string;
  title: string;
  __typename: string;
}

export interface ISnipDetails {
  _id: string;
  title: string;
  text: string;
  language: string;
  favourite: boolean;
  snipsCollection: SnipsCollection;
}

export type CreateSnipMutation = {
  createSnip: ISnip;
};

export type SnipsFromCollectionQuery = {
  snipsFromCollection: ISnip[];
};

export type SnipDetailsQuery = {
  snipDetails: ISnipDetails;
};

export type UpdateSnipMutation = {
  updateSnip: ISnipDetails;
};

export type DeleteSnipMutation = {
  deleteSnip: ISnipDetails;
};

export type UpdateSnipFavouriteMutation = {
  updateSnipFavourite: ISnipDetails;
};
