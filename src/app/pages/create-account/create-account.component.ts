import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToasterStyle } from 'src/app/components/toaster/style';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent {
  formGroup: FormGroup;
  createAccountSuccess = false;
  loading?: boolean;
  error?: boolean;
  toasterStyle = ToasterStyle;

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
    this.loading = true;
    this.authService.createUser(this.emailControl.value, this.passwordControl.value)
    .pipe(
      finalize(() => { 
        this.loading = false;
      }))
    .subscribe({
      next: (res) => {
        this.error = false;
        this.createAccountSuccess = true;

        this.authService.login(this.emailControl.value, this.passwordControl.value).subscribe({
          next:(res) => {
            if (res.data) {
              this.router.navigate(["collections"]);
            }
          }
        });
      },
       error: (err) => {
         this.error = true;
         throw err;
       }
    });
  }
}
