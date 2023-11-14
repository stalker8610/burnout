import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthorizedUserData } from 'src/app/store/data/data.selectors';
import { map, filter } from 'rxjs';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent {

    userAuthorized = this.store.select(getAuthorizedUserData);
    userName = this.userAuthorized.pipe(
        filter(value => !!value),
        map(user => `${user?.lastName || ''} ${user?.firstName || ''} ${user?.middleName || ''}`.trim())
    )

    constructor(private store: Store) { }

}
