import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';

@Component({
    selector: 'app-logout',
    template: '',
    styles: []
})
export class LogoutComponent implements OnInit {

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(AuthActions.logout());
    }
}
