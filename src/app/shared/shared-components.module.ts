import { NgModule } from "@angular/core";
import { ModalComponent } from "../components/modal/modal.component";
import { ToasterComponent } from "../components/toaster/toaster.component";

const components = [ModalComponent, ToasterComponent];

@NgModule({
  declarations: [...components],
  exports: [...components],
})
export class SharedComponentsModule {}
