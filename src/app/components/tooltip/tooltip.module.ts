import { NgModule } from "@angular/core";
import { TooltipComponent } from "./tooltip.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [TooltipComponent],
  imports: [CommonModule, NgbModule],
  exports: [TooltipComponent],
})
export class TooltipModule {}
