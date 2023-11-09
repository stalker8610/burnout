import { getLogoutError } from '../../store/auth/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/store/auth/auth.actions';

@Component({
    selector: 'app-logout',
    template: '<div *ngIf="error$ | async as error">{{error}}</div>',
    styles: []
})
export class LogoutComponent implements OnInit {

    error$ = this.store.select(getLogoutError);

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(logout());
    }
}
