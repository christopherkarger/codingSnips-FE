import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, RouterOutlet, Router } from "@angular/router";
import { CollectionsService } from "../../services/collections.service";
import { SnipsService } from "../../services/snips.service";
import { Observable, Subscription, empty } from "rxjs";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { catchError, tap } from "rxjs/operators";
import { codeLanguages } from "src/app/constants";
import { SnipsCollection } from "./models/snipscollection";
import { Snip } from "../snip/models/snip";
import { ToasterStyle } from "src/app/components/toaster/style";

@Component({
  templateUrl: "./collection-details.component.html",
  styleUrls: ["./collection-details.component.scss"],
})
export class CollectionDetailsComponent implements OnInit, OnDestroy {
  toasterStyle = ToasterStyle;
  codeLanguages = codeLanguages;
  initError = false;
  loading = false;
  deleteCollectionView = false;
  collectionUpdateError = false;
  snipAddError = false;

  @ViewChild("collectionNameInput")
  collectionNameInput?: ElementRef;

  @ViewChild("snipNameInput")
  snipNameInput?: ElementRef;

  editCollectionForm: FormGroup;
  addSnipForm: FormGroup;
  editCollectionModalVisible = false;
  addSnipModalVisible = false;
  collection$?: Observable<SnipsCollection>;
  routeSub$?: Subscription;

  @ViewChild("routerOutlet")
  outlet?: RouterOutlet;

  collectionDetail$?: Observable<Snip[]>;

  snipTitleControl = new FormControl("");
  snipTextControl = new FormControl("");
  snipLanguageControl = new FormControl("");
  snipFavouriteControl = new FormControl(false);

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private collectionsService: CollectionsService,
    private snipsService: SnipsService
  ) {
    this.editCollectionForm = this.fb.group({
      collectionName: new FormControl(""),
    });

    this.addSnipForm = this.fb.group({
      snipTitle: this.snipTitleControl,
      snipText: this.snipTextControl,
      snipLanguage: this.snipLanguageControl,
      snipFavourite: this.snipFavouriteControl,
    });
  }

  ngOnInit(): void {
    this.routeSub$ = this.activeRoute.params.subscribe((routeParams) => {
      this.loading = true;

      this.collection$ = this.collectionsService
        .getCollectionDetails(routeParams.id)
        .pipe(
          tap(() => {
            this.initError = false;
            this.loading = false;
          }),
          catchError((err) => {
            this.initError = true;
            this.loading = false;
            throw err;
          })
        );

      this.collectionDetail$ = this.snipsService.getSnipsFromCollection(
        routeParams.id
      );
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub$) {
      this.routeSub$.unsubscribe();
    }
  }

  private hideEditCollectionModal(): void {
    this.editCollectionModalVisible = false;
  }

  outsideEditCollectionModalClicked(): void {
    this.hideAndResetEditCollectionModal();
  }

  editCollection(collection: SnipsCollection): void {
    if (this.collectionNameInput) {
      this.collectionNameInput.nativeElement.focus();
    }

    this.editCollectionForm.patchValue({
      collectionName: collection.title,
    });
    this.editCollectionModalVisible = true;
  }

  saveEditCollection(collection: SnipsCollection): void {
    const input = this.editCollectionForm.get("collectionName");

    if (input) {
      this.collectionsService
        .updateCollection(collection._id, input.value)
        .subscribe({
          next: () => {
            this.collectionUpdateError = false;
          },
          error: (err) => {
            this.collectionUpdateError = true;
            throw err;
          },
        });
      this.hideEditCollectionModal();
    }
  }

  outsideAddSnipModalClicked(): void {
    this.hideAndResetAddSnipModal();
  }

  hideAndResetEditCollectionModal(): void {
    this.hideEditCollectionModal();
    this.resetDeleteCollection();
  }

  showDeleteCollectionView(): void {
    this.deleteCollectionView = true;
  }

  deleteCollection(collection: SnipsCollection): void {
    this.collectionsService.deleteCollection(collection).subscribe({
      next: () => {
        this.collectionUpdateError = false;
        this.hideAndResetEditCollectionModal();
      },
      error: (err) => {
        this.collectionUpdateError = true;
        throw err;
      },
    });
  }

  private resetDeleteCollection(): void {
    this.deleteCollectionView = false;
  }

  hideAndResetAddSnipModal(): void {
    this.hideAddSnipModal();
    this.addSnipForm.patchValue({
      snipTitle: "",
      snipText: "",
      snipLanguage: "",
      snipFavourite: false,
    });
  }

  private hideAddSnipModal(): void {
    this.addSnipModalVisible = false;
  }

  showSnipModal(): void {
    this.addSnipModalVisible = true;
    if (this.snipNameInput) {
      this.snipNameInput.nativeElement.focus();
    }
  }

  addSnip(collection: SnipsCollection): void {
    if (
      !this.snipTitleControl.value ||
      !this.snipTextControl.value ||
      !this.snipLanguageControl.value
    ) {
      // TODO: Error handling
      return;
    }

    this.snipsService
      .addSnip(
        collection._id,
        this.snipTitleControl.value,
        this.snipTextControl.value,
        this.snipLanguageControl.value,
        this.snipFavouriteControl.value
      )
      .subscribe({
        next: () => {
          this.snipAddError = false;
        },
        error: (err) => {
          this.snipAddError = true;
          throw err;
        },
      });

    this.hideAndResetAddSnipModal();
  }
}
