import { ISnip } from "src/app/graphql/model/snips";

export class Snip {
  _id: string;
  title: string;

  constructor(x: ISnip) {
    this._id = x._id;
    this.title = x.title;
  }
}
