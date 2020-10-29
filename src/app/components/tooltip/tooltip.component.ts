import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.scss"],
})
export class TooltipComponent {
  @Input()
  tooltip?: string;

  @Input()
  placement?: string;

  @Input()
  cssClass?: string;

  @Output()
  readonly clicked = new EventEmitter<void>();

  buttonClicked(): void {
    this.clicked.emit();
  }
}
