import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { CollectionsService } from "../../services/collections.service";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { SnipsCollections } from "./models/snipscollectons";
import { ToasterStyle } from "src/app/components/toaster/style";
import { FavouritesInfo } from "./models/favourites-info";

@Component({
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.scss"],
})
export class CollectionsComponent implements OnInit {
  @ViewChild("collectionNameInput")
  collectionNameInput?: ElementRef;

  newCodeListForm: FormGroup;
  modalVisible = false;
  collectionAddError = false;
  createLoading = false;
  initLoading = false;
  initError = false;
  allCollections$?: Observable<SnipsCollections>;
  favourites$?: Observable<FavouritesInfo>;
  readonly toasterStyle = ToasterStyle;
  readonly collectionNameControl = new FormControl("", Validators.required);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private collectionsService: CollectionsService
  ) {
    this.newCodeListForm = this.fb.group({
      collectionName: this.collectionNameControl,
    });
  }

  ngOnInit(): void {
    this.initLoading = true;
    this.allCollections$ = this.collectionsService.getAllCollections().pipe(
      tap((res) => {
        this.initError = false;
        this.initLoading = false;
        if (res.snipsCollection[0]) {
          this.router.navigate(["/collections", res.snipsCollection[0]._id]);
        }
      }),
      catchError((err) => {
        this.initLoading = false;
        this.initError = true;
        return throwError(err);
      })
    );

    this.favourites$ = this.collectionsService.getFavouritesInfo();
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
    this.createLoading = true;
    this.collectionsService
      .saveNewCollection(this.collectionNameControl.value)
      .subscribe({
        next: () => {
          this.createLoading = false;
          this.collectionAddError = false;
          this.hideModal();
          this.resetForm();
        },
        error: () => {
          this.createLoading = false;
          this.collectionAddError = true;
        },
      });
  }

  abortNewCollection(): void {
    this.hideModal();
    this.resetForm();
  }

  updateCollectionTitle(id: string): void {
    this.collectionsService.updateCollection(id, "changed title").subscribe();
  }
}
