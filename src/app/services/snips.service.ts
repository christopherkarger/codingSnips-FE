import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GraphQlService } from "./graphql.service";
import {
  ISnip,
  CreateSnipMutation,
  SnipsFromCollectionQuery,
  SnipDetailsQuery,
  ISnipDetails,
  UpdateSnipMutation,
  DeleteSnipMutation,
} from "../graphql/model/snips";
import {
  createSnipMutation,
  snipsFromCollectionQuery,
  snipDetailsQuery,
  updateSnipMutation,
  deleteSnipMutation,
} from "../graphql/gql/snips";
import { Router } from "@angular/router";
import { SnipDetails } from "../pages/snip/models/snip-details";
//import { SnipsCollection } from "../pages/collection-details/models/snipscollection";
import { Snip } from "../pages/snip/models/snip";
@Injectable({
  providedIn: "root",
})
export class SnipsService {
  constructor(private router: Router, private graphQlService: GraphQlService) {}

  addSnip(
    collectionId: string,
    title: string,
    text: string,
    language: string
  ): Observable<Snip | undefined> {
    return this.graphQlService
      .mutate<CreateSnipMutation, Snip>(createSnipMutation, {
        collectionId,
        title,
        text,
        language,
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
            return new Snip(result.data.createSnip);
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
    language: string
  ): Observable<SnipDetails | undefined> {
    return this.graphQlService
      .mutate<UpdateSnipMutation, SnipDetails>(updateSnipMutation, {
        snipId,
        title,
        text,
        language,
      })
      .pipe(
        map((result) => {
          if (result.data) {
            return new SnipDetails(result.data.updateSnip);
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
        map((result) => {
          if (result.data) {
            const data = this.graphQlService.readQuery<
              SnipsFromCollectionQuery
            >(snipsFromCollectionQuery, {
              collectionId: result.data.deleteSnip.snipsCollection._id,
            });
            if (data) {
              const newData = data.snipsFromCollection.filter(
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
            return new SnipDetails(result.data.deleteSnip);
          }
        })
      );
  }
}
