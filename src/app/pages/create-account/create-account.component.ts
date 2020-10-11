import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent {
  formGroup: FormGroup;
  loading = false;
  readonly emailControl = new FormControl("", [Validators.required]);
  readonly passwordControl = new FormControl("", [Validators.required]);

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

  createAccount(): void {

  }
}
