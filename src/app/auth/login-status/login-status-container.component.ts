import { Component } from "@angular/core";
import { LoginStatusComponent } from "./login-status.component";
import { Store } from '@ngrx/store';
import { isUserAuthorized, getAuthorizedUserName } from 'src/app/store/auth/auth.selectors';
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'app-login-status-container',
    standalone: true,
    imports: [LoginStatusComponent, AsyncPipe],
    template: `<app-login-status 
                    [authorized]="(authorized$ | async) ?? false" 
                    [userName]="(userName$ | async) ?? ''">
                </app-login-status>`
})
export class LoginStatusContainerComponent {
    authorized$ = isUserAuthorized(this.store);
    userName$ = this.store.select(getAuthorizedUserName);
    constructor(private store: Store) { }
}