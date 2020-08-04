import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable, pipe } from "rxjs";
import { take, tap } from "rxjs/operators";
import { ApolloQueryResult } from "apollo-client";

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
  constructor(private apollo: Apollo) {}

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
        // take(1),
        tap((val) => {
          if (val.data) {
            localStorage.setItem(loginStorageKey, val.data.login.token);
          }
        })
      );
  }
}
