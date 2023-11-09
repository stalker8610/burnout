import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent {

    userAuthorized = this.store.select(getAuthorizedUser);

    constructor(private store: Store) {}

}
