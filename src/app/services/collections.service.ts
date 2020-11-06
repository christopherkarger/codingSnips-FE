import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { GraphQlService } from "./graphql.service";
import {
  ISnipsCollection,
  SnipsCollectionByIdQuery,
  AllSnipsCollectionsQuery,
  UpdateSnipsCollectionNameMutation,
  CreateSnipsCollectionMutation,
  DeleteSnipsCollectionMutation,
  FavouritesInfoQuery,
  FavouritesQuery,
} from "../graphql/model/collections";
import {
  snipsCollectionByIdQuery,
  allSnipsCollectionsQuery,
  updateSnipsCollectionNameMutation,
  createSnipsCollectionMutation,
  deleteSnipsCollectionMutation,
  favouritesInfoQuery,
  favouritesQuery,
} from "../graphql/gql/collections";
import { SnipsCollections } from "../pages/collections/models/snipscollectons";
import { SnipsCollection } from "../pages/collection-details/models/snipscollection";
import { FavouritesInfo } from "../pages/collections/models/favourites-info";
import { Favourites } from "../pages/favourites/models/favourites";
@Injectable({
  providedIn: "root",
})
export class CollectionsService {
  private _collectionsLoaded = false;

  set collectionsLoaded(val: boolean) {
    this._collectionsLoaded = val;
  }

  get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  constructor(private graphQlService: GraphQlService, private router: Router) {}

  getCollectionDetails(collectionId: string): Observable<SnipsCollection> {
    return this.graphQlService
      .watchQuery<SnipsCollectionByIdQuery>(snipsCollectionByIdQuery, {
        collectionId,
      })
      .pipe(
        map((result) => {
          return new SnipsCollection(result.data.snipsCollectionById);
        })
      );
  }

  getAllCollections(): Observable<SnipsCollections> {
    return this.graphQlService
      .watchQuery<AllSnipsCollectionsQuery>(allSnipsCollectionsQuery)
      .pipe(
        map((result) => {
          this.collectionsLoaded = true;
          return new SnipsCollections({
            snipsCollection: result.data.snipsCollections,
          });
        })
      );
  }

  getFavourites(): Observable<Favourites> {
    return this.graphQlService
      .watchQuery<FavouritesQuery>(favouritesQuery)
      .pipe(
        map((result) => {
          return new Favourites({
            snips: result.data.favouriteSnips.snips,
          });
        })
      );
  }

  getFavouritesInfo(): Observable<FavouritesInfo> {
    return this.graphQlService
      .watchQuery<FavouritesInfoQuery>(favouritesInfoQuery)
      .pipe(
        map((result) => {
          return new FavouritesInfo({
            snipsCount: result.data.favouriteSnips.snipsCount,
          });
        })
      );
  }

  updateCollection(
    collectionId: string,
    title: string
  ): Observable<SnipsCollection | undefined> {
    return this.graphQlService
      .mutate<UpdateSnipsCollectionNameMutation, SnipsCollection>(
        updateSnipsCollectionNameMutation,
        {
          collectionId,
          title,
        }
      )
      .pipe(
        map((result) => {
          if (result.data) {
            return new SnipsCollection(result.data.updateSnipsCollectionName);
          }
        })
      );
  }

  saveNewCollection(title: string): Observable<SnipsCollection | undefined> {
    return this.graphQlService
      .mutate<CreateSnipsCollectionMutation, SnipsCollection>(
        createSnipsCollectionMutation,
        { title }
      )
      .pipe(
        tap((result) => {
          if (result.data) {
            try {
              const clientData = this.graphQlService.readQuery<
                AllSnipsCollectionsQuery
              >(allSnipsCollectionsQuery);

              if (clientData) {
                const newCollection = {
                  _id: result.data.createSnipsCollection._id,
                  title,
                  __typename: "SnipsCollection",
                  snipsCount: 0,
                };
                this.graphQlService.writeQuery(allSnipsCollectionsQuery, {
                  snipsCollections: [
                    ...clientData.snipsCollections,
                    newCollection,
                  ],
                });
              }
            } catch (err) {
              // Do nothing if local changes failed
            }
          }
        }),
        map((result) => {
          if (result.data) {
            return new SnipsCollection(result.data?.createSnipsCollection);
          }
        })
      );
  }

  deleteCollection(
    collection: SnipsCollection
  ): Observable<SnipsCollection | undefined> {
    return this.graphQlService
      .mutate<DeleteSnipsCollectionMutation, SnipsCollection>(
        deleteSnipsCollectionMutation,
        { collectionId: collection._id }
      )
      .pipe(
        tap((result) => {
          if (result.data) {
            try {
              const clientData = this.graphQlService.readQuery<
                AllSnipsCollectionsQuery
              >(allSnipsCollectionsQuery);

              if (clientData) {
                const newData = clientData.snipsCollections.filter(
                  (col: ISnipsCollection) => col._id !== collection._id
                );

                if (newData.length === 0) {
                  this.router.navigate(["/collections"]);
                }

                this.graphQlService.writeQuery(allSnipsCollectionsQuery, {
                  snipsCollections: [...newData],
                });
              }
            } catch (err) {
              // Do nothing if local changes failed
            }
          }
        }),
        map((result) => {
          if (result.data) {
            return new SnipsCollection(result.data.deleteSnipsCollection);
          }
        })
      );
  }
}
