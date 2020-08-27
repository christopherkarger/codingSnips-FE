import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";
import { GraphQlService } from "./graphql.service";
import {
  ISnip,
  CreateSnipMutation,
  SnipsFromCollectionQuery,
  SnipDetailsQuery,
  ISnipDetails,
} from "../graphql/model/snips";
import {
  createSnipMutation,
  snipsFromCollectionQuery,
  snipDetailsQuery,
} from "../graphql/gql/snips";

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

  getAllSnipDetailsFromCollection(snipId: string): Observable<ISnipDetails> {
    return this.graphQlService
      .watchQuery<SnipDetailsQuery>(snipDetailsQuery, {
        snipId,
      })
      .pipe(
        map((result) => {
          return result.data.snipDetails;
        })
      );
  }
}
