import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollectionsComponent } from "./collections.component";
import { LoadingComponent } from "../components/loading/loading.component";
import { ModalComponent } from "../components/modal/modal.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ChildRoutesGuardService } from "../services/child-routes-guard.service";

const routes: Routes = [
  {
    path: "",
    component: CollectionsComponent,
    children: [
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
  declarations: [CollectionsComponent, ModalComponent, LoadingComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class CollectionsModule {}
