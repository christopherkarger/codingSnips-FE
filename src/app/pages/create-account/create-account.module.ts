import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateAccountComponent } from "./create-account.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from '../../shared/shared-components.module';

const routes: Routes = [
  {
    path: "",
    component: CreateAccountComponent,
  },
];

@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [],
})
export class CreateAccountModule {}
