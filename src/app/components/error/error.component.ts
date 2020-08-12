import { Component, Input } from "@angular/core";

@Component({
  selector: "error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"],
})
export class ErrorComponent {
  @Input()
  error?: boolean;

  @Input()
  msg?: string;
}
