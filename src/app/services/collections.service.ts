import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { GraphQlService } from "./graphql.service";
import {
  ISnipsCollection,
  SnipsCollectionByIdQuery,
  AllSnipsCollectionsQuery,
  UpdateSnipsCollectionNameMutation,
  CreateSnipsCollectionMutation,
  DeleteSnipsCollectionMutation,
} from "../graphql/model/collections";
import {
  snipsCollectionByIdQuery,
  allSnipsCollectionsQuery,
  updateSnipsCollectionNameMutation,
  createSnipsCollectionMutation,
  deleteSnipsCollectionMutation,
} from "../graphql/gql/collections";
import { SnipsCollections } from "../pages/collections/models/snipscollectons";

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

  constructor(
    private graphQlService: GraphQlService,
    private router: Router,
    private authService: AuthService
  ) {}

  getCollectionDetails(collectionId: string): Observable<ISnipsCollection> {
    return this.graphQlService
      .watchQuery<SnipsCollectionByIdQuery>(snipsCollectionByIdQuery, {
        collectionId,
      })
      .pipe(
        map((result) => {
          return result.data.snipsCollectionById;
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

  updateCollection(
    collectionId: string,
    title: string
  ): Observable<ISnipsCollection | undefined> {
    return this.graphQlService
      .mutate<UpdateSnipsCollectionNameMutation, ISnipsCollection>(
        updateSnipsCollectionNameMutation,
        {
          collectionId,
          title,
        }
      )
      .pipe(
        map((result) => {
          return result.data?.updateSnipsCollectionName;
        })
      );
  }

  saveNewCollection(title: string): Observable<ISnipsCollection | undefined> {
    return this.graphQlService
      .mutate<CreateSnipsCollectionMutation, ISnipsCollection>(
        createSnipsCollectionMutation,
        { title }
      )
      .pipe(
        map((result) => {
          if (result.data) {
            const data = this.graphQlService.readQuery<
              AllSnipsCollectionsQuery
            >(allSnipsCollectionsQuery);
            const newCollection = {
              _id: result.data.createSnipsCollection._id,
              title,
              __typename: "SnipsCollection",
            };

            if (data) {
              this.graphQlService.writeQuery(allSnipsCollectionsQuery, {
                snipsCollections: [...data.snipsCollections, newCollection],
              });
            }
          }

          return result.data?.createSnipsCollection;
        })
      );
  }

  deleteCollection(
    collection: ISnipsCollection
  ): Observable<ISnipsCollection | undefined> {
    return this.graphQlService
      .mutate<DeleteSnipsCollectionMutation, ISnipsCollection>(
        deleteSnipsCollectionMutation,
        { collectionId: collection._id }
      )
      .pipe(
        map((result) => {
          if (result.data) {
            const data = this.graphQlService.readQuery<
              AllSnipsCollectionsQuery
            >(allSnipsCollectionsQuery);

            if (data) {
              const newData = data.snipsCollections.filter(
                (col: ISnipsCollection) => col._id !== collection._id
              );

              if (newData.length === 0) {
                this.router.navigate(["/collections"]);
              }

              this.graphQlService.writeQuery(allSnipsCollectionsQuery, {
                snipsCollections: [...newData],
              });
            }
          }

          return result.data?.deleteSnipsCollection;
        })
      );
  }
}
