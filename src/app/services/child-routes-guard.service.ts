import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CollectionsService } from "./collections.service";

@Injectable({
  providedIn: "root",
})
export class ChildRoutesGuardService implements CanActivate {
  constructor(
    private router: Router,
    private collectionsService: CollectionsService
  ) {}

  canActivate(): boolean {
    if (this.collectionsService.collectionsLoaded) {
      return true;
    } else {
      this.router.navigate(["/collections"]);
      return false;
    }
  }
}
