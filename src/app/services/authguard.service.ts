import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { loginStorageKey } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthguardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem(loginStorageKey);
    if (!token) {
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }
}
