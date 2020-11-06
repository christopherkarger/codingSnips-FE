import { Snip } from '../../snip/models/snip'; 

interface IFavourites {
  snips: Snip[];
}

export class Favourites {
  snips: Snip[];

  constructor(x: IFavourites) {
      this.snips = x.snips;
  }
}