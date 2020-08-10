import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, pipe } from "rxjs";
import { take, tap, map } from "rxjs/operators";
import { ApolloQueryResult } from "apollo-client";
import { Router } from "@angular/router";
import { FetchResult } from "apollo-link";

export type SnipCollection = {
  _id: string;
  title: string;
};

export type Query = {
  snipsCollections: SnipCollection[];
};

export type Mutation = {
  createSnipCollection: SnipCollection;
};

const getSnipsCollectionsQuery = gql`
  query allSnipsCollections {
    snipsCollections {
      _id
      title
    }
  }
`;

const createNewSnipsCollectionMutation = gql`
  mutation createSnipsCollection($title: String!) {
    createSnipsCollection(title: $title) {
      _id
      title
    }
  }
`;

const updateSnipsCollectionMutation = gql`
  mutation updateSnipsCollectionName($collectionId: String!, $title: String!) {
    updateSnipsCollectionName(collectionId: $collectionId, title: $title) {
      _id
      title
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class CollectionsService {
  constructor(private apollo: Apollo, private router: Router) {}

  getAllCollections(): Observable<SnipCollection[]> {
    return this.apollo
      .watchQuery<Query>({
        query: getSnipsCollectionsQuery,
      })
      .valueChanges.pipe(map((result) => result.data.snipsCollections));
  }

  updateCollection(collectionId: string, title: string): any {
    return this.apollo.mutate({
      mutation: updateSnipsCollectionMutation,
      variables: {
        collectionId,
        title,
      },
    });
  }

  saveNewCollection(title: string): Observable<any> {
    return this.apollo.mutate({
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
    });
    // .pipe(
    //   map((result) => {
    //     return result.data;
    //   })
    // );
  }
}
