import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "code-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {
  @Output()
  outsideClicked = new EventEmitter();

  emitOutsideClick(event: MouseEvent): void {
    if (event.target) {
      const target = <HTMLElement>event.target;
      if (target.classList.contains("code-modal")) {
        this.outsideClicked.emit(true);
      }
    }
  }
}
