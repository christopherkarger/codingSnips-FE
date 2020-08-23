import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LogoutService {
  constructor(private router: Router) {}
  logout(): void {
    localStorage.removeItem(environment.loginStorageKey);
    this.router.navigate(["login"]);
  }
}
