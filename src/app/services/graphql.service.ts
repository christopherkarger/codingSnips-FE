import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import { Observable } from "rxjs";
import { FetchResult } from "apollo-link";
import { ApolloQueryResult } from "apollo-client";

@Injectable({
  providedIn: "root",
})
export class GraphQlService {
  constructor(private apollo: Apollo) {}
  readQuery<T>(query: DocumentNode, variables?: unknown): T | null {
    return this.apollo.getClient().readQuery({
      query,
      variables,
    });
  }

  writeQuery(query: DocumentNode, data: any, variables?: any): void {
    this.apollo.getClient().writeQuery({
      query,
      variables,
      data,
    });
  }

  mutate<T, R>(
    mutation: DocumentNode,
    variables: any
  ): Observable<FetchResult> {
    return this.apollo.mutate<T>({
      mutation,
      variables,
    });
  }

  watchQuery<T>(
    query: DocumentNode,
    variables?: any
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo.watchQuery<T>({
      query,
      variables,
    }).valueChanges;
  }
}
