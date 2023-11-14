import { createEffect } from "@ngrx/effects"
import { AuthService, TLoginResult } from "../../services/auth.service"
import { Actions, ofType } from "@ngrx/effects"
import * as AuthActions from './auth.actions'
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core';
import { Router } from "@angular/router"
import { getAuthorizedUser, requestDone } from "./auth.selectors"
import { Store } from "@ngrx/store"
import { concatLatestFrom } from "@ngrx/effects"

export const authStatusRequested$ = createEffect((actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
        ofType(AuthActions.authStatusRequested),
        concatLatestFrom(()=>store.select(requestDone)),
        filter(([action, done]) => !done),
        exhaustMap(([action, done]) => of(AuthActions.getAuthStatus()))
    ),
    { functional: true }
)

export const getAuthStatus$ = createEffect((actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
        ofType(AuthActions.getAuthStatus),
        exhaustMap(() => authService.getMe()
            .pipe(
                map((authorizedUser: TLoginResult | null) => AuthActions.getAuthStatusSuccessful({ user: authorizedUser })),
                catchError((error: { message: string }) => of(AuthActions.getAuthStatusFailed({ error: error.message })))
            )
        )
    ),
    { functional: true }
)

export const getAuthStatusSuccessful$ = createEffect((actions$ = inject(Actions)) =>
    actions$.pipe(
        ofType(AuthActions.getAuthStatusSuccessful),
        filter(data => !!data.user),
        exhaustMap(data => of(AuthActions.loginSuccessful({ ...data.user!, navigate: false })))
    ),
    { functional: true }
)

export const getAuthStatusSuccessfulRedirect$ = createEffect((actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
        ofType(AuthActions.getAuthStatusSuccessful),
        filter(data => !data.user),
        tap(() => router.navigate(['/login']))
    ),
    {
        functional: true,
        dispatch: false
    }
)


export const login$ = createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) =>
        actions$.pipe(
            ofType(AuthActions.login),
            exhaustMap(({ email, password }) => authService.logIn(email, password)
                .pipe(
                    map((authorizedUser: TLoginResult) => AuthActions.loginSuccessful({ ...authorizedUser, navigate: true })),
                    catchError((error: { status: number }) => {
                        console.log(error);
                        let message = 'Неправильный логин или пароль';
                        if (error.status === 504) {
                            message = 'Сервер недоступен. Попробуйте позже';
                        } else if (error.status === 500) {
                            message = 'Произошла ошибка на сервере. Попробуйте позже'
                        }
                        return of(AuthActions.loginFailed({ error: message }))
                    })
                )
            )
        ),
    { functional: true }
)

export const loginSuccessful$ = createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthActions.loginSuccessful),
            tap(action => action.navigate && router.navigate(['/']))
        ),
    {
        functional: true,
        dispatch: false
    }
)

export const logout$ = createEffect((actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => console.log('logout')),
        exhaustMap(() => authService.logOut()
            .pipe(
                map(() => AuthActions.logoutSuccessful({ navigate: true })),
                /* tap(() => router.navigate(['/login'])), */
                catchError((error: { message: string }) => of(AuthActions.logoutFailed({ error: error.message })))
            )
        )
    ),
    { functional: true }
)

export const logoutSuccessful$ = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthActions.logoutSuccessful),
            tap(action => action.navigate && router.navigate(['/login']))
        ),
    {
        functional: true,
        dispatch: false
    }
)