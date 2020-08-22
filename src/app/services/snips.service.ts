import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { map, catchError } from "rxjs/operators";

export interface ISnip {
  _id: string;
  title: string;
  text: string;
}

type CreateSnipMutation = {
  createSnip: ISnip;
};

const createSnipMutation = gql`
  mutation createSnip($collectionId: String!, $text: String!, $title: String!) {
    createSnip(
      snipInput: { collectionId: $collectionId, text: $text, title: $title }
    ) {
      _id
      title
      text
    }
  }
`;

type SnipsFromCollectionQuery = {
  snipsFromCollection: ISnip[];
};

const snipsFromCollectionQuery = gql`
  query snipsFromCollection($collectionId: String!) {
    snipsFromCollection(collectionId: $collectionId) {
      _id
      title
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class SnipsService {
  constructor(private apollo: Apollo, private authService: AuthService) {}

  addSnip(
    collectionId: string,
    title: string,
    text: string
  ): Observable<ISnip | undefined> {
    return this.apollo
      .mutate<CreateSnipMutation>({
        mutation: createSnipMutation,
        variables: {
          collectionId,
          title,
          text,
        },
      })
      .pipe(
        map((result) => {
          if (result.data) {
            //console.log(result.data.createSnip);

            const data = this.apollo.getClient().readQuery({
              query: snipsFromCollectionQuery,
              variables: {
                collectionId,
              },
            });

            const newSnip = {
              _id: result.data.createSnip._id,
              title,
              __typename: "Snip",
            };

            this.apollo.getClient().writeQuery({
              query: snipsFromCollectionQuery,
              variables: {
                collectionId,
              },
              data: {
                snipsFromCollection: [...data.snipsFromCollection, newSnip],
              },
            });
          }

          return result.data?.createSnip;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }

  getSnipsFromCollection(collectionId: string): Observable<ISnip[]> {
    return this.apollo
      .watchQuery<SnipsFromCollectionQuery>({
        query: snipsFromCollectionQuery,
        variables: {
          collectionId,
        },
      })
      .valueChanges.pipe(
        map((result) => {
          return result.data.snipsFromCollection;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }
}
