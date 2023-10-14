import { Validators, FormControl, ValidatorFn, AbstractControl, FormGroup, ValidationErrors, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    @Input() token: string = '';

    hide = true;
    signUpStatus = false;
    signUpError = new Subject<string>();
    loading = false;

    passwordGroup = new FormGroup({
        password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
        passwordConfirm: new FormControl('')
    }, { validators: [checkPasswords] });

    errorMatcher = new MyErrorStateMatcher();

    constructor(private readonly authService: AuthService) { }

    ngOnInit(): void {
        this.loading = true;
        this.passwordGroup.disable();
        this.authService.validateToken(this.token).subscribe({
            next: () => { 
                this.loading = false;
                this.passwordGroup.enable();
            },
            error: (error) => { 
                this.signUpError.next(error.message);
            }
        })
    }

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

        this.loading = true;
        this.signUpError.next('');
        this.passwordGroup.disable();

        this.authService.signUp(this.token,
            this.passwordGroup.controls['password']!.value!).
            subscribe({
                next: () => this.signUpStatus = true,
                error: (error) => {
                    this.signUpError.next(error.message);
                    this.passwordGroup.enable();
                    this.loading = false;
                }
            });
    }

    changePasswordVisibility() {
        if (!this.loading) {
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
        /* const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
        const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
        console.log(control);
        console.log(form); */
        /* return invalidCtrl || invalidParent; */
        /* console.log(form); */
        return !!(form?.invalid && form.dirty && form.form.controls['passwordConfirm']!.touched);
    }
}
