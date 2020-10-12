import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { GraphQlService } from './services/graphql.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(private authService: AuthService, private graphQlService: GraphQlService) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.graphQlService.clearCache();
  }
}
