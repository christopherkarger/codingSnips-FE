import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CollectionsService,
  SnipCollection,
} from "../services/collections.service";
import { Observable } from "rxjs";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

@Component({
  templateUrl: "./collection-details.component.html",
  styleUrls: ["./collection-details.component.scss"],
})
export class CollectionDetailsComponent implements OnInit {
  deleteCollectionView = false;
  collectionUpdateError = false;

  @ViewChild("collectionNameInput")
  collectionNameInput?: ElementRef;

  editCollectionForm: FormGroup;
  modalVisible = false;
  collection$?: Observable<SnipCollection>;

  constructor(
    private activeRoute: ActivatedRoute,
    private collectionService: CollectionsService,
    private fb: FormBuilder,
    private collectionsService: CollectionsService
  ) {
    this.editCollectionForm = this.fb.group({
      collectionName: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.collection$ = this.collectionService.getCollectionDetails(
        routeParams.id
      );
    });
  }

  hideModal(): void {
    this.modalVisible = false;
  }

  outsideModalClicked(): void {
    this.hideAndResetModal();
  }

  editCollection(collection: SnipCollection): void {
    if (this.collectionNameInput) {
      this.collectionNameInput.nativeElement.focus();
    }

    this.editCollectionForm.patchValue({
      collectionName: collection.title,
    });
    this.modalVisible = true;
  }

  saveEditCollection(collection: SnipCollection): void {
    const input = this.editCollectionForm.get("collectionName");

    if (input) {
      this.collectionsService
        .updateCollection(collection._id, input.value)
        .subscribe({
          next: () => {
            this.collectionUpdateError = false;
          },
          error: () => {
            this.collectionUpdateError = true;
          },
        });
      this.hideModal();
    }
  }

  hideAndResetModal(): void {
    this.hideModal();
    this.resetDeleteCollection();
  }

  showDeleteCollectionView(): void {
    this.deleteCollectionView = true;
  }

  deleteCollection(collection: SnipCollection): void {
    this.collectionService.deleteCollection(collection).subscribe({
      next: () => {
        this.hideAndResetModal();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  resetDeleteCollection(): void {
    this.deleteCollectionView = false;
  }
}
