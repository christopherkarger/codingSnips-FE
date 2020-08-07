import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { AuthService } from "../services/auth.service";

const createNewSnipsList = gql`
  mutation createSnipsCollection($title: String!) {
    createSnipsCollection(title: $title) {
      title
    }
  }
`;

@Component({
  templateUrl: "./snips.component.html",
  styleUrls: ["./snips.component.scss"],
})
export class SnipsComponent {
  newCodeList = false;
  newCodeListForm: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private apollo: Apollo
  ) {
    this.newCodeListForm = this.fb.group({
      codeListName: new FormControl("", [Validators.required]),
    });
  }

  showNewCodeListModal(): void {
    this.newCodeList = true;
  }

  hideNewCodeListModal(): void {
    this.newCodeList = false;
  }

  resetForm(): void {
    this.newCodeListForm.patchValue({
      codeListName: new FormControl("", [Validators.required]),
    });
    this.newCodeListForm.reset();
  }

  saveNewCodeList(): void {
    const listName = this.newCodeListForm.get("codeListName");
    if (listName) {
      // save new List
      console.log(listName.value);
      this.apollo
        .mutate({
          mutation: createNewSnipsList,
          variables: {
            title: listName.value,
          },
        })
        .subscribe(
          ({ data }) => {
            console.log("got data", data);
          },
          (error: Error) => {
            // if (error.message.indexOf("Authentication failed") > -1) {
            //   this.authService.logout();
            // }
            throw error;
          }
        );
    }
    this.hideNewCodeListModal();
    this.resetForm();
  }

  abortNewCodeList(): void {
    this.hideNewCodeListModal();
    this.resetForm();
  }
}
