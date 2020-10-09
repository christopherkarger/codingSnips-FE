import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SnipComponent } from "./snip.component";

import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/shared-components.module";
import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

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
    HighlightModule,
  ],
  exports: [],
  providers: [],
})
export class SnipModule {}
