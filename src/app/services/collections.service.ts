import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, pipe, of, throwError } from "rxjs";
import { take, tap, map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export type SnipCollection = {
  _id: string;
  title: string;
};

type AllSnipsCollectionsQuery = {
  snipsCollections: SnipCollection[];
};

type UpdateSnipsCollectionNameQuery = {
  updateSnipsCollectionName: SnipCollection;
};

type CreateSnipsCollectionMutation = {
  createSnipsCollection: SnipCollection;
};

const getSnipsCollectionsQuery = gql`
  query allSnipsCollections {
    snipsCollections {
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

  getAllCollections(): Observable<SnipCollection[]> {
    return this.apollo
      .watchQuery<AllSnipsCollectionsQuery>({
        query: getSnipsCollectionsQuery,
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
  ): Observable<SnipCollection | undefined> {
    const updateSnipsCollectionMutation = gql`
      mutation updateSnipsCollectionName(
        $collectionId: String!
        $title: String!
      ) {
        updateSnipsCollectionName(collectionId: $collectionId, title: $title) {
          _id
          title
        }
      }
    `;
    return this.apollo
      .mutate<UpdateSnipsCollectionNameQuery>({
        mutation: updateSnipsCollectionMutation,
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

  saveNewCollection(title: string): Observable<SnipCollection | undefined> {
    const createNewSnipsCollectionMutation = gql`
      mutation createSnipsCollection($title: String!) {
        createSnipsCollection(title: $title) {
          _id
          title
        }
      }
    `;
    return this.apollo
      .mutate<CreateSnipsCollectionMutation>({
        mutation: createNewSnipsCollectionMutation,
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
              query: getSnipsCollectionsQuery,
            });
            const newCollection = {
              _id: result.data.createSnipsCollection._id,
              title,
              __typename: "SnipsCollection",
            };

            this.apollo.getClient().writeQuery({
              query: getSnipsCollectionsQuery,
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
}
