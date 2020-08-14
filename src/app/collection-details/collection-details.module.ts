import { NgModule } from "@angular/core";
import { CollectionDetailsComponent } from "./collection-details.component";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedComponentsModule } from "../shared/shared-components.module";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    component: CollectionDetailsComponent,
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
