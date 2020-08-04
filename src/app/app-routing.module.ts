import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardService } from "./services/authguard.service";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/snips",
  },
  {
    path: "snips",
    canActivate: [AuthguardService],
    loadChildren: () =>
      import("./snips/snips.module").then((m) => m.SnipsModule),
  },

  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
