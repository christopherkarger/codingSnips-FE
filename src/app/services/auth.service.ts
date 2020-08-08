import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, pipe } from "rxjs";
import { take, tap } from "rxjs/operators";
import { ApolloQueryResult } from "apollo-client";
import { Router } from "@angular/router";

export const loginStorageKey = "cod-login-token";

interface ILoginData {
  login: {
    token: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private apollo: Apollo, private router: Router) {}

  checkError(error: Error): void {
    if (error.message.indexOf("Authentication failed") > -1) {
      this.logout();
    }
  }

  isLoggedIn(): boolean {
    // Return true if token is stored, otherwise false
    return !!localStorage.getItem(loginStorageKey);
  }

  logout(): void {
    localStorage.removeItem(loginStorageKey);
    this.router.navigate(["login"]);
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

    return this.apollo
      .watchQuery<ILoginData>({
        query: loginQuery,
        variables: {
          email,
          password,
        },
      })
      .valueChanges.pipe(
        take(1),
        tap((val) => {
          if (val.data) {
            localStorage.setItem(loginStorageKey, val.data.login.token);
          }
        })
      );
  }
}
