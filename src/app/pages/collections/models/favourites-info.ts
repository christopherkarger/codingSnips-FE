interface IFavouritesInfo {
  snipsCount: number;
}

export class FavouritesInfo {
  snipsCount: number;

  constructor(x: IFavouritesInfo) {
      this.snipsCount = x.snipsCount;
  }
}