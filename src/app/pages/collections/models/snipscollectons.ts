import { SnipsCollection } from "./snipscollection";

interface ISnipsCollections {
  snipsCollection: SnipsCollection[];
}

export class SnipsCollections {
  snipsCollection: SnipsCollection[];

  constructor(x: ISnipsCollections) {
    this.snipsCollection = x.snipsCollection;
  }
}
