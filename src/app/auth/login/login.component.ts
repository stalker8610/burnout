import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    email = new FormControl('', { validators: [Validators.required, Validators.email] });
    password = new FormControl('', { validators: [Validators.required] });

    constructor(private store: Store) { }

    auth() {
        this.store.dispatch(AuthActions.login({ email: this.email.value as string, password: this.password.value as string }));
    }

}
