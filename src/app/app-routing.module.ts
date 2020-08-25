import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardService } from "./services/authguard.service";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/collections",
  },
  {
    path: "collections",
    canActivate: [AuthguardService],
    loadChildren: () =>
      import("./pages/collections/collections.module").then(
        (m) => m.CollectionsModule
      ),
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
