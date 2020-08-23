import { Injectable } from "@angular/core";
import gql from "graphql-tag";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { map, catchError } from "rxjs/operators";
import { GraphQlService } from "./graphql.service";

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
  constructor(
    private graphQlService: GraphQlService,
    private authService: AuthService
  ) {}

  addSnip(
    collectionId: string,
    title: string,
    text: string
  ): Observable<ISnip | undefined> {
    return this.graphQlService
      .mutate<CreateSnipMutation, ISnip>(createSnipMutation, {
        collectionId,
        title,
        text,
      })
      .pipe(
        map((result) => {
          if (result.data) {
            const data = this.graphQlService.readQuery<
              SnipsFromCollectionQuery
            >(snipsFromCollectionQuery, { collectionId });

            const newSnip = {
              _id: result.data.createSnip._id,
              title,
              __typename: "Snip",
            };

            if (data) {
              this.graphQlService.writeQuery(
                snipsFromCollectionQuery,
                { snipsFromCollection: [...data.snipsFromCollection, newSnip] },
                { collectionId }
              );
            }
          }

          return result.data?.createSnip;
        })
      );
  }

  getSnipsFromCollection(collectionId: string): Observable<ISnip[]> {
    return this.graphQlService
      .watchQuery<SnipsFromCollectionQuery>(snipsFromCollectionQuery, {
        collectionId,
      })
      .pipe(
        map((result) => {
          return result.data.snipsFromCollection;
        })
      );
  }
}
