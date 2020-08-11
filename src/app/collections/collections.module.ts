import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollectionsComponent } from "./collections.component";
import { ModalComponent } from "../components/modal/modal.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    component: CollectionsComponent,
    children: [
      {
        path: ":id",
        loadChildren: () =>
          import("../collection-details/collection-details.module").then(
            (m) => m.CollectionDetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [CollectionsComponent, ModalComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class CollectionsModule {}
