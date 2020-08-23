export interface ISnip {
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
