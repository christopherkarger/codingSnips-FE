import { ISnipsCollection } from "../../../graphql/model/collections";

export class SnipsCollection {
  _id: string;
  title: string;
  snips?: any[];
  snipsCount: number; 

  constructor(x: ISnipsCollection) {
    this._id = x._id;
    this.title = x.title;
    this.snips = x.snips;
    this.snipsCount = x.snipsCount
  }
}
