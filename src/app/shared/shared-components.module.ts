import { NgModule } from "@angular/core";
import { ModalComponent } from "../components/modal/modal.component";

const components = [ModalComponent];

@NgModule({
  declarations: [...components],
  exports: [...components],
})
export class SharedComponentsModule {}
