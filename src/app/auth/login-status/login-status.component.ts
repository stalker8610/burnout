import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthorizedUser, getAuthorizedUserName } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent {

    userAuthorized = this.store.select(getAuthorizedUser);
    userName = this.store.select(getAuthorizedUserName);

    constructor(private store: Store) { }

}
