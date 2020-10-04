import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  formGroup: FormGroup;
  loading?: boolean;
  error?: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const emailInput = new FormControl("", [Validators.required]);
    const passwordInput = new FormControl("", [Validators.required]);
    this.formGroup = this.fb.group({
      email: emailInput,
      password: passwordInput,
    });
  }
  login() {
    const email = this.formGroup.get("email");
    const password = this.formGroup.get("password");

    if (this.formGroup.invalid || !email || !password) {
      // TODO: Handle Form rrors
      return;
    }

    this.loading = true;

    this.authService.login(email.value, password.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.data) {
          this.router.navigate(["collections"]);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        throw err;
      },
    });
  }
}
