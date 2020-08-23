import { Injectable } from "@angular/core";
import gql from "graphql-tag";
import { Observable, pipe } from "rxjs";
import { take, tap } from "rxjs/operators";
import { ApolloQueryResult } from "apollo-client";
import { GraphQlService } from "./graphql.service";
import { environment } from "../../environments/environment";
import { LogoutService } from "./logout.service";

interface ILoginData {
  login: {
    token: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private graphQlService: GraphQlService,
    private logoutService: LogoutService
  ) {}

  isLoggedIn(): boolean {
    // Return true if token is stored, otherwise false
    return !!localStorage.getItem(environment.loginStorageKey);
  }

  logout(): void {
    this.logoutService.logout();
  }

  login(
    email: string,
    password: string
  ): Observable<ApolloQueryResult<ILoginData>> {
    const loginQuery = gql`
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;

    return this.graphQlService
      .watchQuery<ILoginData>(loginQuery, {
        email,
        password,
      })
      .pipe(
        take(1),
        tap((val) => {
          if (val.data) {
            localStorage.setItem(
              environment.loginStorageKey,
              val.data.login.token
            );
          }
        })
      );
  }
}
