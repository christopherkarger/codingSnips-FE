import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { AuthService } from "../services/auth.service";
import { SnipsCollectionsService } from "../services/snips-collections.service";

@Component({
  templateUrl: "./snips.component.html",
  styleUrls: ["./snips.component.scss"],
})
export class SnipsComponent implements OnInit {
  newCodeList = false;
  newCodeListForm: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snipsCollectionsService: SnipsCollectionsService
  ) {
    this.newCodeListForm = this.fb.group({
      codeListName: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.snipsCollectionsService.getSnipsCollections().subscribe({
      next: ({ data }) => {
        console.log(data);
      },
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
      this.snipsCollectionsService.saveNewCodeList(listName.value).subscribe({
        next: ({ data }) => {
          console.log(data);
        },
        error: (error: Error) => {
          this.authService.checkError(error);
          throw error;
        },
      });
    } else {
      throw new Error("codeListName not set");
    }
    this.hideNewCodeListModal();
    this.resetForm();
  }

  abortNewCodeList(): void {
    this.hideNewCodeListModal();
    this.resetForm();
  }
}
