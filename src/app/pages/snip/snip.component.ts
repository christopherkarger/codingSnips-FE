import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ISnipDetails, ISnip } from "src/app/graphql/model/snips";
import { SnipsService } from "src/app/services/snips.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { tap, catchError } from "rxjs/operators";

@Component({
  templateUrl: "./snip.component.html",
  styleUrls: ["./snip.component.scss"],
})
export class SnipComponent implements OnInit, OnDestroy {
  initError = false;
  loading = false;
  deleteSnipModalVisible = false;
  snipUpdateError = false;
  snipDeleteError = false;
  editSnipForm: FormGroup;
  editSnipModalVisible = false;
  routeSub$?: Subscription;
  snip$?: Observable<ISnipDetails>;

  constructor(
    private snipService: SnipsService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private snipsService: SnipsService
  ) {
    this.editSnipForm = this.fb.group({
      snipTitle: new FormControl(""),
      snipText: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.routeSub$ = this.activeRoute.params.subscribe((routeParams) => {
      this.loading = true;

      this.snip$ = this.snipsService
        .getAllSnipDetailsFromCollection(routeParams.id)
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
    });
  }
  ngOnDestroy(): void {
    if (this.routeSub$) {
      this.routeSub$.unsubscribe();
    }
  }

  private showEditSnipModal(): void {
    this.editSnipModalVisible = true;
  }

  private hideEditSnipModal(): void {
    this.editSnipModalVisible = false;
  }

  outsideEditSnipModalClicked(): void {
    this.abortEditSnip();
  }

  editSnip(snip: ISnipDetails): void {
    this.editSnipForm.patchValue({
      snipTitle: snip.title,
      snipText: snip.text,
    });
    this.showEditSnipModal();
  }

  saveEditSnip(snip: ISnipDetails): void {
    const snipTitle = this.editSnipForm.get("snipTitle");
    const snipText = this.editSnipForm.get("snipText");

    if (snipTitle && snipText) {
      this.snipService
        .updateSnip(snip._id, snipTitle.value, snipText.value)
        .subscribe({
          next: () => {
            this.snipUpdateError = false;
            this.hideEditSnipModal();
          },
          error: (err) => {
            this.snipUpdateError = true;
            this.hideEditSnipModal();
            throw err;
          },
        });
    }
  }

  abortEditSnip(): void {
    this.hideEditSnipModal();
  }

  private showDeleteSnipModal(): void {
    this.deleteSnipModalVisible = true;
  }

  hideDeleteSnipModal(): void {
    this.deleteSnipModalVisible = false;
  }

  deleteSnip(): void {
    this.showDeleteSnipModal();
  }

  deleteSnipRequest(snip: ISnipDetails) {
    this.snipService.deleteSnip(snip._id).subscribe({
      next: () => {
        this.snipDeleteError = false;
        this.hideDeleteSnipModal();
      },
      error: (err) => {
        this.snipDeleteError = true;
        this.hideDeleteSnipModal();
        throw err;
      },
    });
  }
}
