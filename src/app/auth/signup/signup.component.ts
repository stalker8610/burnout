import { Validators, FormControl, ValidatorFn, AbstractControl, FormGroup, ValidationErrors, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Component, Input, Output, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        NgIf],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnChanges {

    @Input() blockInterface = false;
    @Output('signup') signUpEvent = new EventEmitter<string>();

    showPassword = false;
    passwordGroup = new FormGroup({
        password: new FormControl('', { validators: [Validators.required, Validators.minLength(4)] }),
        passwordConfirm: new FormControl(''),
    }, { validators: [checkPasswords] });

    errorMatcher = new MyErrorStateMatcher();

    ngOnChanges() {
        if (this.blockInterface) {
            this.passwordGroup.disable();
        } else {
            this.passwordGroup.enable();
        }
    }

    signUp() {
        this.signUpEvent.emit(this.passwordGroup.getRawValue().password as string);
    }

    getPasswordErrorMessage(): string {
        if (this.passwordGroup.hasError('required', 'password')) {
            return 'Введите пароль';
        } else if (this.passwordGroup.hasError('minlength', 'password')) {
            return 'Укажите не менее 4-x символов';
        }

        return '';
    }

    getConfirmErrorMessage() {
        return 'Пароли не совпадают'
    }

    hasPasswordError() {
        return this.passwordGroup.controls['password'].invalid;
    }

    hasConfirmError() {
        return this.passwordGroup.hasError('notMatches');
    }

    changePasswordVisibility() {
        if (!this.blockInterface) {
            this.showPassword = !this.showPassword;
        }
    }

}

const checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const passwordValue = (group as FormGroup).controls['password']!.value;
    const passwordConfirmValue = (group as FormGroup).controls['passwordConfirm']!.value;
    return passwordValue === passwordConfirmValue ? null : { notMatches: true }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: NgForm | null): boolean {
        return !!(form?.invalid && form.dirty && form.form.controls['passwordConfirm']!.touched);
    }
}
