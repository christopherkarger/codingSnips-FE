import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { SnipsService } from "src/app/services/snips.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { tap, catchError } from "rxjs/operators";
import { codeLanguages } from "src/app/constants";
import { SnipDetails } from "./models/snip-details";
import { ToasterStyle } from "src/app/components/toaster/style";

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
  snipDetails$?: Observable<SnipDetails>;
  readonly toasterStyle = ToasterStyle;
  readonly codeLanguages = codeLanguages;
  readonly snipTitleControl = new FormControl("", Validators.required);
  readonly snipTextControl = new FormControl("", Validators.required);
  readonly snipLanguageControl = new FormControl("", Validators.required);
  readonly snipFavouriteControl = new FormControl(false);

  constructor(
    private snipService: SnipsService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private snipsService: SnipsService
  ) {
    this.editSnipForm = this.fb.group({
      snipTitle: this.snipTitleControl,
      snipText: this.snipTextControl,
      snipLanguage: this.snipLanguageControl,
      snipFavourite: this.snipFavouriteControl,
    });
  }

  ngOnInit(): void {
    this.routeSub$ = this.activeRoute.params.subscribe((routeParams) => {
      this.loading = true;

      this.snipDetails$ = this.snipsService
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

  editSnip(snip: SnipDetails): void {
    this.editSnipForm.patchValue({
      snipTitle: snip.title,
      snipText: snip.text,
      snipLanguage: snip.language,
      snipFavourite: snip.favourite,
    });
    this.showEditSnipModal();
  }

  toggleFavourite(snip: SnipDetails): void {
    this.snipService.updateSnipFavourite(snip, !snip.favourite).subscribe({
      next: (val) => {},
      error: (err) => {
        this.snipUpdateError = true;
        this.hideEditSnipModal();
        throw err;
      },
    });
  }

  saveEditSnip(snip: SnipDetails): void {
    this.snipService
      .updateSnip(
        snip._id,
        this.snipTitleControl.value,
        this.snipTextControl.value,
        this.snipLanguageControl.value,
        this.snipFavouriteControl.value
      )
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

  deleteSnipRequest(snip: SnipDetails) {
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
