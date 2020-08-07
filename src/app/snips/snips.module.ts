import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SnipsComponent } from "./snips.component";
import { ModalComponent } from "../components/modal/modal.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    component: SnipsComponent,
  },
];

@NgModule({
  declarations: [SnipsComponent, ModalComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class SnipsModule {}
