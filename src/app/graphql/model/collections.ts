import { ISnip } from "./snips";

export interface IFavouriteSnipsInfo {
  snipsCount: number;
}

export interface IFavouriteSnips {
  snips: ISnip[];
}

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

export type FavouritesInfoQuery = {
  favouriteSnips: IFavouriteSnipsInfo;
};

export type FavouritesQuery = {
  favouriteSnips: IFavouriteSnips;
};
