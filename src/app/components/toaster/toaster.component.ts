import { Component, Output, EventEmitter, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { ToasterStyle } from './style';
@Component({
  selector: "toaster",
  templateUrl: "./toaster.component.html",
  styleUrls: ["./toaster.component.scss"],
  animations: [
    trigger("openClose", [
      state(
        "show",
        style({
          transform: "translateX(0%)",
        })
      ),
      state(
        "hide",
        style({
          transform: "translateX(100%) translateX(20px)",
        })
      ),
      transition("show => hide", [animate("0.3s ease-out")]),
      transition("hide => show", [animate("0.3s ease-out")]),
    ]),
  ],
})
export class ToasterComponent {
  toasterStyle = ToasterStyle;
  
  private _visible = false

  @Input()
  msg?: string;

  @Input()
  styling?: ToasterStyle;

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
