import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CollectionsService,
  SnipCollection,
} from "../services/collections.service";
import { Observable } from "rxjs";

@Component({
  templateUrl: "./collection-details.component.html",
  styleUrls: ["./collection-details.component.scss"],
})
export class CollectionDetailsComponent implements OnInit {
  collection$?: Observable<SnipCollection>;

  constructor(
    private activeRoute: ActivatedRoute,
    private collectionService: CollectionsService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.collection$ = this.collectionService.getCollectionDetails(
        routeParams.id
      );
    });
  }

  editCollection(collection: SnipCollection): void {}
}
