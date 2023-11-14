import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthorizedUser } from '../store/auth/auth.selectors';
import { filter, map } from 'rxjs';
import { Scopes } from '@models/user.model';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    Scopes = Scopes;

    constructor(private store: Store) { }

    getUser() {
        return this.store.select(getAuthorizedUser).pipe(
            filter(value => !!value)
        )
    }

    hasScope(scope: Scopes) {
        return this.getUser().pipe(
            map(user => user!.scope === scope)
        )
    }

}
