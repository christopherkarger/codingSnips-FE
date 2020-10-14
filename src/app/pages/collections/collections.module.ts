import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollectionsComponent } from "./collections.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ChildRoutesGuardService } from "../../services/child-routes-guard.service";
import { SharedComponentsModule } from "../../shared/shared-components.module";
import { CodingIconComponent } from "../../components/coding-icon/coding-icon.component";

const routes: Routes = [
  {
    path: "",
    component: CollectionsComponent,
    children: [
      {
        path: "favourites",
        canActivate: [ChildRoutesGuardService],
        loadChildren: () =>
          import("../favourites/favourites.module").then(
            (m) => m.FavouritesModule
          ),
      },
      {
        path: ":id",
        canActivate: [ChildRoutesGuardService],
        loadChildren: () =>
          import("../collection-details/collection-details.module").then(
            (m) => m.CollectionDetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [CollectionsComponent, CodingIconComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
  ],
  exports: [],
  providers: [],
})
export class CollectionsModule {}
