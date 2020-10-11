import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { CollectionsService } from "../../services/collections.service";
import { Observable, throwError } from "rxjs";
import { tap, catchError, finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import { ISnipsCollection } from "../../graphql/model/collections";
import { SnipsCollections } from "./models/snipscollectons";
import { ToasterStyle } from 'src/app/components/toaster/style';

@Component({
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.scss"],
})
export class CollectionsComponent implements OnInit {
  @ViewChild("collectionNameInput")
  collectionNameInput?: ElementRef;
  toasterStyle = ToasterStyle;
  modalVisible = false;
  collectionAddError = false;
  newCodeListForm: FormGroup;
  allCollections$?: Observable<SnipsCollections>;
  createLoading = false;
  initLoading = false;
  initError = false;

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
      this.createLoading = true;
      this.collectionsService.saveNewCollection(input.value).subscribe({
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
    } else {
      throw new Error("codeListName not set");
    }
  }

  abortNewCollection(): void {
    this.hideModal();
    this.resetForm();
  }

  updateCollectionTitle(id: string): void {
    this.collectionsService.updateCollection(id, "changed title").subscribe();
  }
}
