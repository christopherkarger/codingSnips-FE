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
import { ToasterStyle } from 'src/app/components/toaster/style';

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  toasterStyle = ToasterStyle;
  formGroup: FormGroup;
  readonly emailControl = new FormControl("", [Validators.required]);
  readonly passwordControl = new FormControl("", [Validators.required]);

  loading?: boolean;
  error?: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.formGroup = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
    });
  }
  login() {
    
    if (this.formGroup.invalid || !this.passwordControl.value || !this.emailControl.value) {
      // TODO: Handle Form rrors
      return;
    }

    this.loading = true;

    this.authService.login(this.emailControl.value, this.passwordControl.value).subscribe({
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
