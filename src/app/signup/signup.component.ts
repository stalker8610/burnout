import { Validators, FormControl, ValidatorFn, AbstractControl, FormGroup, ValidationErrors, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

    hide = true;

    passwordGroup = new FormGroup({
        /* email: new FormControl(''), */
        password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
        passwordConfirm: new FormControl('')
    }, { validators: [checkPasswords] });

    errorMatcher = new MyErrorStateMatcher();

    constructor(private readonly authService: AuthService) { }

    getPasswordErrorMessage(): string {
        if (this.passwordGroup.hasError('required', 'password')) {
            return 'Введите пароль';
        } else if (this.passwordGroup.hasError('minlength', 'password')) {
            return 'Укажите не менее 8 символов';
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

    signUp() {
        this.authService.signUp(
            this.passwordGroup.controls['email']!.value!,
            this.passwordGroup.controls['password']!.value!);
    }

}

const checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const passwordValue = (group as FormGroup).controls['password']!.value;
    const passwordConfirmValue = (group as FormGroup).controls['passwordConfirm']!.value;
    return passwordValue === passwordConfirmValue ? null : { notMatches: true }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: NgForm | null): boolean {
        /* const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
        const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
        console.log(control);
        console.log(form); */
        /* return invalidCtrl || invalidParent; */
        /* console.log(form); */
        return !!(form?.invalid && form.dirty && form.form.controls['passwordConfirm']!.touched);
    }
}
