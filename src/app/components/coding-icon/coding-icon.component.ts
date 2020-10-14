import { Component, Input } from "@angular/core";

@Component({
  selector: "coding-icon",
  templateUrl: "./coding-icon.component.html",
  styleUrls: ["./coding-icon.component.scss"],
})
export class CodingIconComponent {
  @Input()
  title?: string;

  languages = [
    "html",
    "typescript",
    "javascript",
    "linux",
    "terminal",
    "php",
    "c++",
    "c#",
    "sass",
    "css",
    "react",
    "vuejs",
    "angular",
    "python",
    "ruby",
    "rust",
  ];

  titleCodingIcon(title?: string): string | undefined {
    if (!title) {
      return undefined;
    }
    const lowerTitle = title.toLowerCase();
    return this.languages.find((l) =>
      lowerTitle.split(" ").some((r) => r === l)
    );
  }
}
