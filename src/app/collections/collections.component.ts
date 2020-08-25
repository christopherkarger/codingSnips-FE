import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { CollectionsService } from "../services/collections.service";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { ISnipCollection } from "../graphql/model/collections";

@Component({
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.scss"],
})
export class CollectionsComponent implements OnInit {
  @ViewChild("collectionNameInput")
  collectionNameInput?: ElementRef;

  modalVisible = false;
  collectionAddError = false;
  newCodeListForm: FormGroup;
  allCollections$?: Observable<ISnipCollection[] | undefined>;
  loading?: boolean;
  error?: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private collectionsService: CollectionsService
  ) {
    this.newCodeListForm = this.fb.group({
      collectionName: new FormControl("", [Validators.required]),
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

  showModal(): void {
    if (this.collectionNameInput) {
      this.collectionNameInput.nativeElement.focus();
    }
    this.modalVisible = true;
  }

  hideModal(): void {
    this.modalVisible = false;
  }

  outsideModalClicked(): void {
    this.hideModal();
  }

  resetForm(): void {
    this.newCodeListForm.patchValue({
      collectionName: new FormControl("", [Validators.required]),
    });
    this.newCodeListForm.reset();
  }

  saveNewCollection(): void {
    const input = this.newCodeListForm.get("collectionName");
    if (input) {
      this.collectionsService.saveNewCollection(input.value).subscribe({
        next: () => {
          this.collectionAddError = false;
        },
        error: () => {
          this.collectionAddError = true;
        },
      });
    } else {
      throw new Error("codeListName not set");
    }
    this.hideModal();
    this.resetForm();
  }

  abortNewCollection(): void {
    this.hideModal();
    this.resetForm();
  }

  updateCollectionTitle(id: string): void {
    this.collectionsService.updateCollection(id, "changed title").subscribe();
  }
}
