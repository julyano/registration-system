import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from "@angular/forms";
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  public hidePassword = true;
  public hideConfirmPassword = true;
  public pattern = /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{6,}$/;
  public registrationForm: FormGroup;
  public today =new Date();

  constructor(
    public formBuilder: FormBuilder,
    private notifyService : NotificationService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$'),
        Validators.minLength(3),
        Validators.compose([
          this.controlValuesHasSpecificValue('name')
        ])
      ]],
      username: ['', [
        Validators.required,
        Validators.pattern('^(?=[a-zA-Z0-9._]{3,50}$)(?!.*[_.]{2})[^_.].*[^_.]$'),
        Validators.minLength(3),
        Validators.compose([
          this.controlValuesHasSpecificValue('username')
        ])
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      datebirth: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'),
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'),
        Validators.minLength(6),
        Validators.compose([
          this.controlValuesAreEqual('password', 'confirmPassword')
        ])
      ]],
    });
   }

  public errorHandling = (control: string, error: string) => {
    return this.registrationForm?.get(control)?.hasError(error);
  }

  private controlValuesAreEqual(controlNameA: string, controlNameB: string): ValidatorFn {
    return (): ValidationErrors | null => {
      const valueA = this.registrationForm?.get(controlNameA)?.value as string;
      const valueB = this.registrationForm?.get(controlNameB)?.value as string;

      return (valueA === valueB)? null : { valuesDoNotMatch: true };
    }
  }

  private controlValuesHasSpecificValue(controlName: string): ValidatorFn {
    return (): ValidationErrors | null => {
      let value = this.registrationForm?.get(controlName)?.value as any;

      if (controlName === 'name') {
        value = value?.split(' ')[0]?.toLowerCase()
      }

      const regex: RegExp = /^(?!.*((R|r)(O|o)(D|d)(R|r)(I|i)(G|g)(O|o)|(R|r)(O|o)(S|s)(I|i)(E|e)(R|r)(Y|y)|(B|b)(R|r)(U|u)(N|n)(O|o)))/;

      return regex.test(value)? null : { valuesNotAllowed: true };
    }
  }

  public date(e: any): void {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);

    if(!this.registrationForm?.get('datebirth')?.hasError) {
      this.registrationForm?.get('datebirth')?.setValue(convertDate, {
        onlyself: true,
      });
    }
  }

  public onStrengthChanged(event: any): void {
  }

  public async submitForm(): Promise<void> {
    if (this.registrationForm.valid) {
      const translation = await this.translateService.get('form.messages.success').toPromise();
      this.notifyService.showSuccess(translation);
      this.registrationForm.reset();

      for(var name in this.registrationForm.controls) {
        this.registrationForm?.get(name)?.setErrors(null);
      }

      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);

    }
  }

}
