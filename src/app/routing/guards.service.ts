
import { getAuthorizedUser, requestDone } from './../store/auth/auth.selectors';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, tap, filter } from 'rxjs';
import { authStatusRequested } from '../store/auth/auth.actions';
import { concatLatestFrom } from '@ngrx/effects';
import { Scopes } from '@models/user.model';

export const isAuthorizedGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('isAuthorizedGuard').pipe(
        tap(console.log),
        map(user => user !== null || router.parseUrl('/login'))
    )
}

export const isNotAuthorizedGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('isNotAuthorizedGuard').pipe(
        map(user => !user || router.parseUrl('/'))
    )
}

export const isHRUserGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('').pipe(
        map(user => user?.scope === Scopes.HR || router.parseUrl('/'))
    )
}

export const isAdminUserGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('').pipe(
        map(user => user?.scope === Scopes.Admin || router.parseUrl('/'))
    )
}

const getUser = (stage: string) => {
    const store = inject(Store);
    store.dispatch(authStatusRequested());

    return store.select(getAuthorizedUser).pipe(
        concatLatestFrom(() => store.select(requestDone)),
        filter(([user, done]) => done),
        take(1),
        map(([user]) => user)
    )
}

export const redirectHomeGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return getUser('').pipe(
        map(user => {
            if (user?.scope === Scopes.HR) {
                return router.parseUrl('/home/wall');
            } else if (user?.scope === Scopes.User) {
                return router.parseUrl('/home/my');
            } else if (user?.scope === Scopes.Admin) {
                return router.parseUrl('/home/admin');
            } else {
                return router.parseUrl('/login');
            }
        })
    )
}