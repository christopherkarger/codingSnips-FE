import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CollectionsService,
  ISnipCollection,
} from "../services/collections.service";
import { ISnip, SnipsService } from "../services/snips.service";
import { Observable } from "rxjs";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

@Component({
  templateUrl: "./collection-details.component.html",
  styleUrls: ["./collection-details.component.scss"],
})
export class CollectionDetailsComponent implements OnInit {
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
  collection$?: Observable<ISnipCollection>;

  collectionDetail$?: Observable<ISnip[]>;

  constructor(
    private activeRoute: ActivatedRoute,
    private collectionService: CollectionsService,
    private fb: FormBuilder,
    private collectionsService: CollectionsService,
    private snipsService: SnipsService
  ) {
    this.editCollectionForm = this.fb.group({
      collectionName: new FormControl(""),
    });

    this.addSnipForm = this.fb.group({
      snipTitle: new FormControl(""),
      snipText: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.collection$ = this.collectionService.getCollectionDetails(
        routeParams.id
      );

      this.collectionDetail$ = this.snipsService.getSnipsFromCollection(
        routeParams.id
      );
    });
  }

  private hideEditCollectionModal(): void {
    this.editCollectionModalVisible = false;
  }

  outsideEditCollectionModalClicked(): void {
    this.hideAndResetEditCollectionModal();
  }

  editCollection(collection: ISnipCollection): void {
    if (this.collectionNameInput) {
      this.collectionNameInput.nativeElement.focus();
    }

    this.editCollectionForm.patchValue({
      collectionName: collection.title,
    });
    this.editCollectionModalVisible = true;
  }

  saveEditCollection(collection: ISnipCollection): void {
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

  deleteCollection(collection: ISnipCollection): void {
    this.collectionService.deleteCollection(collection).subscribe({
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

  addSnip(collection: ISnipCollection): void {
    const snipTitle = this.addSnipForm.get("snipTitle");
    const snipText = this.addSnipForm.get("snipText");

    if (snipTitle && snipText) {
      this.snipsService
        .addSnip(collection._id, snipTitle.value, snipText.value)
        .subscribe({
          next: () => {
            this.snipAddError = false;
          },
          error: (err) => {
            this.snipAddError = true;
            throw err;
          },
        });
    }
    this.hideAndResetAddSnipModal();
  }
}
