import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    loginGroup = new FormGroup({
        email: new FormControl('', { validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { validators: [Validators.required] })
    })

    constructor(private store: Store) { }

    auth() {
        const { email, password } = this.loginGroup.getRawValue() as { email: string, password: string };
        this.store.dispatch(AuthActions.login({ email, password }));
    }

}
