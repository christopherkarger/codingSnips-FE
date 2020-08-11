import { NgModule } from "@angular/core";
import { CollectionDetailsComponent } from "./collection-details.component";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

const routes: Routes = [
  {
    path: "",
    component: CollectionDetailsComponent,
  },
];

@NgModule({
  declarations: [CollectionDetailsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CollectionDetailsModule {}
