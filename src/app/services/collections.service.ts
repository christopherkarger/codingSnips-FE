import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, pipe, of, throwError } from "rxjs";
import { take, tap, map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

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
    private apollo: Apollo,
    private router: Router,
    private authService: AuthService
  ) {}

  getCollectionDetails(collectionId: string): Observable<ISnipCollection> {
    return this.apollo
      .watchQuery<SnipsCollectionByIdQuery>({
        query: snipsCollectionByIdQuery,
        variables: {
          collectionId,
        },
      })
      .valueChanges.pipe(
        map((result) => {
          console.log(result);
          return result.data.snipsCollectionById;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }

  getAllCollections(): Observable<ISnipCollection[]> {
    return this.apollo
      .watchQuery<AllSnipsCollectionsQuery>({
        query: allSnipsCollectionsQuery,
      })
      .valueChanges.pipe(
        map((result) => {
          this.collectionsLoaded = true;
          return result.data.snipsCollections;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }

  updateCollection(
    collectionId: string,
    title: string
  ): Observable<ISnipCollection | undefined> {
    return this.apollo
      .mutate<UpdateSnipsCollectionNameMutation>({
        mutation: updateSnipsCollectionNameMutation,
        variables: {
          collectionId,
          title,
        },
      })
      .pipe(
        map((result) => {
          return result.data?.updateSnipsCollectionName;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }

  saveNewCollection(title: string): Observable<ISnipCollection | undefined> {
    return this.apollo
      .mutate<CreateSnipsCollectionMutation>({
        mutation: createSnipsCollectionMutation,
        variables: {
          title,
        },

        // optimisticResponse: {
        //   __typename: "Mutation",
        //   createSnipsCollection: {
        //     __typename: "SnipsCollection",
        //     _id: Math.random().toString(36).substring(7),
        //     title: listName,
        //   },
        // },
      })
      .pipe(
        map((result) => {
          if (result.data) {
            const data = this.apollo.getClient().readQuery({
              query: allSnipsCollectionsQuery,
            });
            const newCollection = {
              _id: result.data.createSnipsCollection._id,
              title,
              __typename: "SnipsCollection",
            };

            this.apollo.getClient().writeQuery({
              query: allSnipsCollectionsQuery,
              data: {
                snipsCollections: [...data.snipsCollections, newCollection],
              },
            });
          }

          return result.data?.createSnipsCollection;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }

  deleteCollection(
    collection: ISnipCollection
  ): Observable<ISnipCollection | undefined> {
    return this.apollo
      .mutate<DeleteSnipsCollectionMutation>({
        mutation: deleteSnipsCollectionMutation,
        variables: {
          collectionId: collection._id,
        },
      })
      .pipe(
        map((result) => {
          if (result.data) {
            const data = this.apollo.getClient().readQuery({
              query: allSnipsCollectionsQuery,
            });

            const newData = data.snipsCollections.filter(
              (col: ISnipCollection) => col._id !== collection._id
            );

            if (newData.length === 0) {
              this.router.navigate(["/collections"]);
            }

            this.apollo.getClient().writeQuery({
              query: allSnipsCollectionsQuery,
              data: {
                snipsCollections: [...newData],
              },
            });
          }

          return result.data?.deleteSnipsCollection;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }
}
