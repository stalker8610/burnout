import { Validators, FormControl, ValidatorFn, AbstractControl, FormGroup, ValidationErrors, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Component, Input, OnInit } from '@angular/core';
import { first, filter, BehaviorSubject } from 'rxjs';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { isNotNull } from 'src/app/store/util';

import { Store } from '@ngrx/store';
import { isSignUpSuccessful, isSignupTokenValid } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    @Input() token: string = '';

    hide = true;
    isSignupTokenValid = this.store.select(isSignupTokenValid)
    isSignUpSuccessful = this.store.select(isSignUpSuccessful)
    inProcess = new BehaviorSubject<boolean>(true);
    passwordGroup = new FormGroup({
        password: new FormControl('', { validators: [Validators.required, Validators.minLength(4)] }),
        passwordConfirm: new FormControl(''),
    }, { validators: [checkPasswords] });

    errorMatcher = new MyErrorStateMatcher();

    constructor(private readonly store: Store) {
        this.inProcess.subscribe(value => {
            if (value) {
                this.passwordGroup.disable();
            } else {
                this.passwordGroup.enable();
            }
        })
    }

    ngOnInit(): void {
        this.store.dispatch(AuthActions.validateToken({ token: this.token }));
        this.store.select(isSignupTokenValid)
            .pipe(
                first(isNotNull),
                filter(valid => valid)
            ).subscribe(() => this.inProcess.next(false))
    }

    signUp() {
        this.inProcess.next(true);
        const password = this.passwordGroup.controls.password.value!;
        this.store.dispatch(AuthActions.signup({ token: this.token, password }));
        this.store.select(isSignUpSuccessful)
            .pipe(
                first(isNotNull),
                filter(valid => !valid)
            ).subscribe(() => this.inProcess.next(false))
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
        if (!this.inProcess.getValue()) {
            this.hide = !this.hide;
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
