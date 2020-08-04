import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class LoginModule {}
