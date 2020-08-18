import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { SnipCollection } from "./collections.service";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { map, catchError } from "rxjs/operators";

export type Snip = {
  _id: string;
  title: string;
  text: string;
};

type CreateSnipMutation = {
  createSnip: Snip;
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

@Injectable({
  providedIn: "root",
})
export class SnipsService {
  constructor(private apollo: Apollo, private authService: AuthService) {}

  addSnip(
    collectionId: string,
    title: string,
    text: string
  ): Observable<Snip | undefined> {
    return this.apollo
      .mutate<CreateSnipMutation>({
        mutation: createSnipMutation,
        variables: {
          collectionId,
          title,
          text,
        },
      })
      .pipe(
        map((result) => {
          return result.data?.createSnip;
        }),
        catchError((error) => {
          this.authService.checkError(error);
          return throwError(error);
        })
      );
  }
}
