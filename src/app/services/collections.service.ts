import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, pipe } from "rxjs";
import { take, tap, map } from "rxjs/operators";
import { ApolloQueryResult } from "apollo-client";
import { Router } from "@angular/router";
import { FetchResult } from "apollo-link";

interface ICreateSnipsCollection {
  createSnipsCollection: {
    _id: string;
    title: string;
  };
}

const getSnipsCollectionsQuery = gql`
  query {
    snipsCollections {
      _id
      title
    }
  }
`;

const createNewSnipsCollectionQuery = gql`
  mutation createSnipsCollection($title: String!) {
    createSnipsCollection(title: $title) {
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

  getAllCollections(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: getSnipsCollectionsQuery,
      })
      .valueChanges.pipe(map((result) => result.data));
  }

  saveNewCollection(
    listName: string
  ): Observable<FetchResult<ICreateSnipsCollection>> {
    return this.apollo.mutate({
      mutation: createNewSnipsCollectionQuery,
      variables: {
        title: listName,
      },
    });
  }
}
