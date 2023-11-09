
import { getAuthorizedUser, requestDone } from './../store/auth/auth.selectors';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, tap, take, withLatestFrom, filter } from 'rxjs';
import { authStatusRequested } from '../store/auth/auth.actions';

export const isAuthorizedGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('isAuthorizedGuard').pipe(
        //tap( user=> console.log(user !== null || router.parseUrl('/login'))),
        map(user => user !== null || router.parseUrl('/login'))
    )
}

export const isNotAuthorizedGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('isNotAuthorizedGuard').pipe(
        map(user => !user /* || router.parseUrl('/') */)
    )
}

const getUser = (stage: string) => {
    const store = inject(Store);
    store.dispatch(authStatusRequested());

    return store.select(getAuthorizedUser).pipe(
        withLatestFrom(store.select(requestDone)),
        filter(([user, done]) => done),
        take(1),
        tap(([user]) => console.log(stage, 'authorized user:', user)),
        map(([user]) => user)
    )
}

