import { Component, Output, EventEmitter, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "code-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  animations: [
    trigger("openCloseModal", [
      state(
        "open",
        style({
          transform: "translateY(0px)",
        })
      ),
      state(
        "closed",
        style({
          transform: "translateY(300px)",
        })
      ),
      transition("open => closed", [animate("0.2s ease-out")]),
      transition("closed => open", [animate("0.2s ease-out")]),
    ]),
  ],
})
export class ModalComponent {
  @Input()
  visible = false;

  @Output()
  outsideClicked = new EventEmitter();

  emitOutsideClick(event: MouseEvent): void {
    if (event.target) {
      const target = <HTMLElement>event.target;
      if (target.classList.contains("code-modal__bg")) {
        this.outsideClicked.emit(true);
      }
    }
  }
}
