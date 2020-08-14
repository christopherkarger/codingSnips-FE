import { Component, Output, EventEmitter, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "toaster",
  templateUrl: "./toaster.component.html",
  styleUrls: ["./toaster.component.scss"],
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          transform: "translateX(0%)",
        })
      ),
      state(
        "closed",
        style({
          transform: "translateX(100%) translateX(20px)",
        })
      ),
      transition("open => closed", [animate("0.3s ease-out")]),
      transition("closed => open", [animate("0.3s ease-out")]),
    ]),
  ],
})
export class ToasterComponent {
  private _visible = false;

  @Input()
  msg?: string;

  @Input()
  get visible(): boolean {
    return this._visible;
  }

  @Output()
  visibleChange = new EventEmitter<boolean>();

  set visible(val: boolean) {
    this._visible = val;
    this.visibleChange.emit(val);
    if (val) {
      setTimeout(() => {
        this._visible = false;
        this.visibleChange.emit(false);
      }, 4000);
    }
  }
}
