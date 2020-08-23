import { Injectable } from "@angular/core";
import gql from "graphql-tag";
import { Observable, pipe, of, throwError } from "rxjs";
import { take, tap, map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { GraphQlService } from "./graphql.service";

export interface ISnipCollection {
  _id: string;
  title: string;
  snips?: any[];
}

type SnipsCollectionByIdQuery = {
  snipsCollectionById: ISnipCollection;
};

const snipsCollectionByIdQuery = gql`
  query snipsCollectionById($collectionId: String!) {
    snipsCollectionById(collectionId: $collectionId) {
      _id
      title
      snips {
        title
      }
    }
  }
`;

type AllSnipsCollectionsQuery = {
  snipsCollections: ISnipCollection[];
};

const allSnipsCollectionsQuery = gql`
  query allSnipsCollections {
    snipsCollections {
      _id
      title
    }
  }
`;

type UpdateSnipsCollectionNameMutation = {
  updateSnipsCollectionName: ISnipCollection;
};

const updateSnipsCollectionNameMutation = gql`
  mutation updateSnipsCollectionName($collectionId: String!, $title: String!) {
    updateSnipsCollectionName(collectionId: $collectionId, title: $title) {
      _id
      title
    }
  }
`;

type CreateSnipsCollectionMutation = {
  createSnipsCollection: ISnipCollection;
};

const createSnipsCollectionMutation = gql`
  mutation createSnipsCollection($title: String!) {
    createSnipsCollection(title: $title) {
      _id
      title
    }
  }
`;

type DeleteSnipsCollectionMutation = {
  deleteSnipsCollection: ISnipCollection;
};

const deleteSnipsCollectionMutation = gql`
  mutation deleteSnipsCollection($collectionId: String!) {
    deleteSnipsCollection(collectionId: $collectionId) {
      _id
      title
    }
  }
`;

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

  getCollectionDetails(collectionId: string): Observable<ISnipCollection> {
    return this.graphQlService
      .watchQuery<SnipsCollectionByIdQuery>(snipsCollectionByIdQuery, {
        collectionId,
      })
      .pipe(
        map((result) => {
          console.log(result);
          return result.data.snipsCollectionById;
        })
      );
  }

  getAllCollections(): Observable<ISnipCollection[]> {
    return this.graphQlService
      .watchQuery<AllSnipsCollectionsQuery>(allSnipsCollectionsQuery)
      .pipe(
        map((result) => {
          this.collectionsLoaded = true;
          return result.data.snipsCollections;
        })
      );
  }

  updateCollection(
    collectionId: string,
    title: string
  ): Observable<ISnipCollection | undefined> {
    return this.graphQlService
      .mutate<UpdateSnipsCollectionNameMutation, ISnipCollection>(
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

  saveNewCollection(title: string): Observable<ISnipCollection | undefined> {
    return this.graphQlService
      .mutate<CreateSnipsCollectionMutation, ISnipCollection>(
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
    collection: ISnipCollection
  ): Observable<ISnipCollection | undefined> {
    return this.graphQlService
      .mutate<DeleteSnipsCollectionMutation, ISnipCollection>(
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
                (col: ISnipCollection) => col._id !== collection._id
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
