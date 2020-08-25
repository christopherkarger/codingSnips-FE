import { NgModule } from "@angular/core";
import { CollectionDetailsComponent } from "./collection-details.component";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedComponentsModule } from "../../shared/shared-components.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ChildRoutesGuardService } from "../../services/child-routes-guard.service";

const routes: Routes = [
  {
    path: "",
    component: CollectionDetailsComponent,
    children: [
      {
        path: ":id",
        canActivate: [ChildRoutesGuardService],
        loadChildren: () =>
          import("../snip/snip.module").then((m) => m.SnipModule),
      },
    ],
  },
];

@NgModule({
  declarations: [CollectionDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedComponentsModule,
  ],
})
export class CollectionDetailsModule {}
