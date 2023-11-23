import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';
import { map, filter } from 'rxjs';
import { concatRespondentName } from 'src/app/store/data/data.util';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent {

    userAuthorized = this.store.select(getAuthorizedUser);
    userName = this.userAuthorized.pipe(
        filter(value => !!value?.respondent),
        map(user => concatRespondentName(user?.respondent!))
    )

    constructor(private store: Store) { }

}
