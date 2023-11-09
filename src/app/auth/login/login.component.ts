import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from 'src/app/store/auth/auth.actions';
import { getLoginError } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    email = new FormControl('', { validators: [Validators.required, Validators.email] });
    password = new FormControl('', { validators: [Validators.required] });

    error$ = this.store.select(getLoginError);

    constructor(private store: Store) { }

    auth() {
        this.store.dispatch(login({ email: this.email.value as string, password: this.password.value as string }));
    }

}
