import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { FetchResult } from "apollo-link";
import { ApolloQueryResult } from "apollo-client";
import { Router } from "@angular/router";
import { LogoutService } from "./logout.service";

@Injectable({
  providedIn: "root",
})
export class GraphQlService {
  constructor(
    private apollo: Apollo,
    private router: Router,
    private logoutService: LogoutService
  ) {}
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
  ): Observable<FetchResult<T>> {
    return this.apollo
      .mutate<T>({
        mutation,
        variables,
      })
      .pipe(
        catchError((err) => {
          this.checkError(err);
          return throwError(err);
        })
      );
  }

  watchQuery<T>(
    query: DocumentNode,
    variables?: any
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo
      .watchQuery<T>({
        query,
        variables,
      })
      .valueChanges.pipe(
        catchError((err) => {
          this.checkError(err);
          return throwError(err);
        })
      );
  }

  private checkError(error: Error): void {
    if (error.message.indexOf("Authentication failed") > -1) {
      this.logoutService.logout();
    }
  }

  clearCache(): void {
    this.apollo.getClient().cache.reset()
  }
}
