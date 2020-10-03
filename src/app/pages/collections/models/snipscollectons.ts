import { SnipsCollection } from "../../collection-details/models/snipscollection";

interface ISnipsCollections {
  snipsCollection: SnipsCollection[];
}

export class SnipsCollections {
  snipsCollection: SnipsCollection[];

  constructor(x: ISnipsCollections) {
    this.snipsCollection = x.snipsCollection;
  }
}
