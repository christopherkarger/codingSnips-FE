export interface ISnip {
  _id: string;
  title: string;
}

export interface ISnipDetails {
  _id: string;
  title: string;
  text: string;
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
