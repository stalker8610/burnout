import { Component } from "@angular/core";
import { LoginComponent } from "./login.component";
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';

@Component({
    selector: 'app-login-containter',
    template: '<app-login (login)="auth($event)"></app-login>',
    standalone: true,
    imports: [LoginComponent]
})
export class LoginContainerComponent {

    constructor(private store: Store) { }

    auth(e: { email: string, password: string }) {
        this.store.dispatch(AuthActions.login(e));
    }
}