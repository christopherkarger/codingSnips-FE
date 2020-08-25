import { NgModule } from "@angular/core";
import { ModalComponent } from "../components/modal/modal.component";
import { ToasterComponent } from "../components/toaster/toaster.component";
import { LoadingComponent } from "../components/loading/loading.component";
import { ErrorComponent } from "../components/error/error.component";
import { CommonModule } from "@angular/common";

const components = [
  ModalComponent,
  ToasterComponent,
  ErrorComponent,
  LoadingComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: [...components],
  exports: [CommonModule, ...components],
})
export class SharedComponentsModule {}
