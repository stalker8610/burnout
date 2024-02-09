import { Component, Input, OnInit } from "@angular/core";
import { SignupComponent } from "./signup.component";
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { first, filter } from 'rxjs';
import { isSignUpSuccessful, isSignupTokenValid } from 'src/app/store/auth/auth.selectors';
import { isNotNull } from 'src/app/store/util';

@Component({
    selector: 'app-signup-container',
    imports: [SignupComponent],
    standalone: true,
    template: '<app-signup [blockInterface]="blockInterface" (signup)="signUp($event)"></app-signup>'
})
export class SignupContainerComponent implements OnInit {

    @Input() token: string = '';
    blockInterface = false;

    constructor(private readonly store: Store) { }

    ngOnInit(): void {
        this.blockInterface = true;
        this.store.dispatch(AuthActions.validateToken({ token: this.token }));
        this.store.select(isSignupTokenValid)
            .pipe(
                first(isNotNull),
                filter(valid => valid)
            ).subscribe(() => this.blockInterface = false)
    }

    signUp(password: string) {
        this.blockInterface = true;
        this.store.dispatch(AuthActions.signup({ token: this.token, password }));
        this.store.select(isSignUpSuccessful)
            .pipe(
                first(isNotNull),
                filter(successful => !successful)
            ).subscribe(() => this.blockInterface = false)
    }
}