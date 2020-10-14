import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { GraphQlService } from "./graphql.service";
import {
  ISnip,
  CreateSnipMutation,
  SnipsFromCollectionQuery,
  SnipDetailsQuery,
  UpdateSnipFavouriteMutation,
  UpdateSnipMutation,
  DeleteSnipMutation,
} from "../graphql/model/snips";
import {
  createSnipMutation,
  snipsFromCollectionQuery,
  snipDetailsQuery,
  updateSnipMutation,
  deleteSnipMutation,
  updateSnipFavouriteMutation,
} from "../graphql/gql/snips";
import { Router } from "@angular/router";
import { SnipDetails } from "../pages/snip/models/snip-details";
import { Snip } from "../pages/snip/models/snip";
import {
  allSnipsCollectionsQuery,
  favouritesInfoQuery,
  favouritesQuery,
} from "../graphql/gql/collections";
import {
  AllSnipsCollectionsQuery,
  FavouritesInfoQuery,
  FavouritesQuery,
} from "../graphql/model/collections";
@Injectable({
  providedIn: "root",
})
export class SnipsService {
  constructor(private router: Router, private graphQlService: GraphQlService) {}

  addSnip(
    collectionId: string,
    title: string,
    text: string,
    language: string,
    favourite: boolean
  ): Observable<Snip | undefined> {
    return this.graphQlService
      .mutate<CreateSnipMutation, Snip>(createSnipMutation, {
        collectionId,
        title,
        text,
        language,
        favourite,
      })
      .pipe(
        tap((result) => {
          if (result.data) {
            this.updateLocalSnipsCount(true, collectionId);
            try {
              const snipsFromCollection = this.graphQlService.readQuery<
                SnipsFromCollectionQuery
              >(snipsFromCollectionQuery, { collectionId });

              if (snipsFromCollection) {
                this.graphQlService.writeQuery(
                  snipsFromCollectionQuery,
                  {
                    snipsFromCollection: [
                      ...snipsFromCollection.snipsFromCollection,
                      {
                        _id: result.data.createSnip._id,
                        title,
                        __typename: "Snip",
                      },
                    ],
                  },
                  { collectionId }
                );
              }
            } catch (err) {
              // Do nothing if local changes failed
            }
            if (favourite) {
              this.updateLocalSnipFavourite(result.data.createSnip, favourite);
            }
          }
        }),
        map((result) => {
          if (result.data) {
            return new SnipDetails(result.data.createSnip);
          }
        })
      );
  }

  getSnipsFromCollection(collectionId: string): Observable<Snip[]> {
    return this.graphQlService
      .watchQuery<SnipsFromCollectionQuery>(snipsFromCollectionQuery, {
        collectionId,
      })
      .pipe(
        map((result) => {
          return result.data.snipsFromCollection.map((x) => {
            return new Snip(x);
          });
        })
      );
  }

  getAllSnipDetailsFromCollection(snipId: string): Observable<SnipDetails> {
    return this.graphQlService
      .watchQuery<SnipDetailsQuery>(snipDetailsQuery, {
        snipId,
      })
      .pipe(
        map((result) => {
          return new SnipDetails(result.data.snipDetails);
        })
      );
  }

  updateSnip(
    snipId: string,
    title: string,
    text: string,
    language: string,
    favourite: boolean
  ): Observable<SnipDetails | undefined> {
    return this.graphQlService
      .mutate<UpdateSnipMutation, SnipDetails>(updateSnipMutation, {
        snipId,
        title,
        text,
        language,
        favourite,
      })
      .pipe(
        tap((result) => {
          if (result.data && favourite) {
            const snip = new SnipDetails(result.data.updateSnip);
            this.updateLocalSnipFavourite(snip, favourite);
          }
        }),
        map((result) => {
          if (result.data) {
            return new SnipDetails(result.data.updateSnip);
          }
        })
      );
  }

  private updateLocalSnipsCount(countUp: boolean, collectionId: string) {
    try {
      const allSnipsCollections = this.graphQlService.readQuery<
        AllSnipsCollectionsQuery
      >(allSnipsCollectionsQuery);

      if (allSnipsCollections) {
        this.graphQlService.writeQuery(allSnipsCollectionsQuery, {
          snipsCollections: allSnipsCollections.snipsCollections.map((c) => {
            return {
              ...c,
              snipsCount:
                c._id === collectionId
                  ? countUp
                    ? c.snipsCount + 1
                    : c.snipsCount - 1
                  : c.snipsCount,
            };
          }),
        });
      }
    } catch (err) {
      // Do nothing if local changes failed
    }
  }

  private updateLocalSnipFavourite(
    snip: SnipDetails,
    addFavourite: boolean
  ): void {
    try {
      const infoData = this.graphQlService.readQuery<FavouritesInfoQuery>(
        favouritesInfoQuery
      );
      if (infoData) {
        this.graphQlService.writeQuery(favouritesInfoQuery, {
          favouriteSnips: {
            ...infoData.favouriteSnips,
            snipsCount: addFavourite
              ? infoData.favouriteSnips.snipsCount + 1
              : infoData.favouriteSnips.snipsCount - 1,
          },
        });
      }
    } catch (err) {
      // Do nothing if local changes failed
    }

    try {
      const favouritesData = this.graphQlService.readQuery<FavouritesQuery>(
        favouritesQuery
      );

      if (favouritesData) {
        let favSnips = favouritesData.favouriteSnips.snips.map((s) => ({
          ...s,
        }));

        if (addFavourite) {
          favSnips.push({
            _id: snip._id,
            title: snip.title,
            __typename: "Snip",
          });
        } else {
          favSnips = favSnips.filter((s) => s._id !== snip._id);
        }

        this.graphQlService.writeQuery(favouritesQuery, {
          favouriteSnips: {
            ...favouritesData.favouriteSnips,
            snips: favSnips,
          },
        });

        if (!addFavourite && this.router.url.includes("favourites")) {
          this.router.navigate(["/collections/favourites"]);
        }
      }
    } catch (err) {
      // Do nothing if local changes failed
    }
  }

  updateSnipFavourite(
    snip: SnipDetails,
    favourite: boolean
  ): Observable<SnipDetails | undefined> {
    return this.graphQlService
      .mutate<UpdateSnipFavouriteMutation, SnipDetails>(
        updateSnipFavouriteMutation,
        {
          snipId: snip._id,
          favourite,
        }
      )
      .pipe(
        tap((result) => {
          if (result.data) {
            this.updateLocalSnipFavourite(snip, favourite);
          }
        }),
        map((result) => {
          if (result.data) {
            return new SnipDetails(result.data.updateSnipFavourite);
          }
        })
      );
  }

  deleteSnip(snipId: string): Observable<SnipDetails | undefined> {
    return this.graphQlService
      .mutate<DeleteSnipMutation, SnipDetails>(deleteSnipMutation, {
        snipId,
      })
      .pipe(
        tap((result) => {
          if (result.data) {
            this.updateLocalSnipsCount(
              false,
              result.data.deleteSnip.snipsCollection._id
            );

            try {
              const clientData = this.graphQlService.readQuery<
                SnipsFromCollectionQuery
              >(snipsFromCollectionQuery, {
                collectionId: result.data.deleteSnip.snipsCollection._id,
              });
              if (clientData) {
                const newData = clientData.snipsFromCollection.filter(
                  (col: ISnip) => col._id !== snipId
                );

                this.graphQlService.writeQuery(
                  snipsFromCollectionQuery,
                  {
                    snipsFromCollection: [...newData],
                  },
                  { collectionId: result.data.deleteSnip.snipsCollection._id }
                );

                this.router.navigate([
                  `/collections/${result.data.deleteSnip.snipsCollection._id}`,
                ]);
              }
            } catch (err) {
              // Do nothing if local changes failed
            }

            if (result.data.deleteSnip.favourite) {
              this.updateLocalSnipFavourite(result.data.deleteSnip, false);
            }
          }
        }),
        map((result) => {
          if (result.data) {
            return new SnipDetails(result.data.deleteSnip);
          }
        })
      );
  }
}
