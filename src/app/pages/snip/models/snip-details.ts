import { ISnipDetails } from "src/app/graphql/model/snips";
import { SnipsCollection } from "../../collection-details/models/snipscollection";

export class SnipDetails {
  _id: string;
  title: string;
  text: string;
  language: string;
  favourite: boolean;
  snipsCollection: {
    _id: string;
  };

  constructor(x: ISnipDetails) {
    this._id = x._id;
    this.title = x.title;
    this.text = x.text;
    this.language = x.language;
    this.favourite = x.favourite;
    this.snipsCollection = x.snipsCollection;
  }
}
