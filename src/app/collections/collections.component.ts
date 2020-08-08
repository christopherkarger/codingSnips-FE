import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { CollectionsService } from "../services/collections.service";
import { FetchResult } from "apollo-link";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApolloQueryResult } from "apollo-client";

@Component({
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.scss"],
})
export class CollectionsComponent implements OnInit {
  newCodeList = false;
  newCodeListForm: FormGroup;
  allCollections$?: Observable<any>;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private collectionsService: CollectionsService
  ) {
    this.newCodeListForm = this.fb.group({
      codeListName: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.allCollections$ = this.collectionsService.getAllCollections().pipe(
      tap((res) => {
        console.log(res);
      })
    );
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

  saveNewCollection(): void {
    const listName = this.newCodeListForm.get("codeListName");
    if (listName) {
      this.collectionsService.saveNewCollection(listName.value).subscribe({
        next: ({ data }) => {
          if (data) {
            console.log(data);
          }
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
