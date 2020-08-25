import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SnipComponent } from "./snip.component";

import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/shared-components.module";

const routes: Routes = [
  {
    path: "",
    component: SnipComponent,
  },
];

@NgModule({
  declarations: [SnipComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
  ],
  exports: [],
  providers: [],
})
export class SnipModule {}
