import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ISnipDetails } from "src/app/graphql/model/snips";
import { SnipsService } from "src/app/services/snips.service";

@Component({
  templateUrl: "./snip.component.html",
  styleUrls: ["./snip.component.scss"],
})
export class SnipComponent implements OnInit, OnDestroy {
  routeSub$?: Subscription;
  snip$?: Observable<ISnipDetails>;

  constructor(
    private activeRoute: ActivatedRoute,
    private snipsService: SnipsService
  ) {}

  ngOnInit(): void {
    this.routeSub$ = this.activeRoute.params.subscribe((routeParams) => {
      this.snip$ = this.snipsService.getAllSnipDetailsFromCollection(
        routeParams.id
      );
    });
  }
  ngOnDestroy(): void {
    if (this.routeSub$) {
      this.routeSub$.unsubscribe();
    }
  }
}
