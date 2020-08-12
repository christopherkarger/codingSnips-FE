import { Component, OnInit, EventEmitter } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  CollectionsService,
  SnipCollection,
} from "../services/collections.service";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.scss"],
})
export class CollectionsComponent implements OnInit {
  newCodeList = false;
  newCodeListForm: FormGroup;
  allCollections$?: Observable<SnipCollection[] | undefined>;
  loading?: boolean;
  error?: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private collectionsService: CollectionsService
  ) {
    this.newCodeListForm = this.fb.group({
      codeListName: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.allCollections$ = this.collectionsService.getAllCollections().pipe(
      tap((res) => {
        this.loading = false;
        this.error = false;
        if (res[0]) {
          this.router.navigate(["/collections", res[0]._id]);
        }
      }),
      catchError((err) => {
        this.error = true;
        this.loading = false;
        return throwError(err);
      })
    );
  }

  showNewCodeListModal(): void {
    this.newCodeList = true;
  }

  hideNewCodeListModal(): void {
    this.newCodeList = false;
  }

  outsideModalClicked(): void {
    this.hideNewCodeListModal();
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
        next: (res) => {
          console.log(res);
        },
      });
    } else {
      throw new Error("codeListName not set");
    }
    this.hideNewCodeListModal();
    this.resetForm();
  }

  abortNewCollection(): void {
    this.hideNewCodeListModal();
    this.resetForm();
  }

  updateCollectionTitle(id: string): void {
    this.collectionsService.updateCollection(id, "changed title").subscribe();
  }

  openCollection(collection: SnipCollection): void {
    this.router.navigate(["/collections", collection._id]);
  }
}
