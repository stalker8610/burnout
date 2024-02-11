import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthorizedUser } from '../store/auth/auth.selectors';
import { filter, map, first } from 'rxjs';
import { Scopes } from '@models/user.model';
import { isNotNull } from '../store/util';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [MatListModule, RouterModule, NgIf, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

    Scopes = Scopes;
    user = this.store.select(getAuthorizedUser).pipe(
        filter(isNotNull),
        first()
    )

    constructor(private store: Store) { }

    hasScope(scope: Scopes) {
        return this.user.pipe(
            map(user => user.scope === scope),
            first()
        )
    }
}
