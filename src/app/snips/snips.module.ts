import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SnipsComponent } from "./snips.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: SnipsComponent,
  },
];

@NgModule({
  declarations: [SnipsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class SnipsModule {}
