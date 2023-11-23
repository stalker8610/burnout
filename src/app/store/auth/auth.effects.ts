import { createEffect } from "@ngrx/effects"
import { AuthService, TLoginResult } from "../../services/auth.service"
import { Actions, ofType } from "@ngrx/effects"
import * as AuthActions from './auth.actions'
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core';
import { Router } from "@angular/router"
import { requestDone } from "./auth.selectors"
import { Store } from "@ngrx/store"
import { concatLatestFrom } from "@ngrx/effects"
import { MatSnackBar } from "@angular/material/snack-bar"

export const authStatusRequested$ = createEffect((actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
        ofType(AuthActions.authStatusRequested),
        concatLatestFrom(() => store.select(requestDone)),
        filter(([action, done]) => !done),
        exhaustMap(() => of(AuthActions.getAuthStatus()))
    ),
    { functional: true }
)

export const getAuthStatus$ = createEffect((actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
        ofType(AuthActions.getAuthStatus),
        exhaustMap(() => authService.getMe()
            .pipe(
                map((authorizedUser: TLoginResult | null) => AuthActions.getAuthStatusSuccessful({ user: authorizedUser })),
                catchError((error: { message: string, status: number }) => {
                    let message = error.message;
                    if (error.status === 504) {
                        message = 'Сервер недоступен. Попробуйте позже';
                    } else if (error.status === 500) {
                        message = 'Произошла ошибка на сервере. Попробуйте позже'
                    }
                    return of(AuthActions.getAuthStatusFailed({ message }))
                })
            )
        )
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
                    map(() => AuthActions.loginSuccessful()),
                    catchError((error: { status: number }) => {
                        console.log(error);
                        let message = 'Неправильный логин или пароль';
                        if (error.status === 504) {
                            message = 'Сервер недоступен. Попробуйте позже';
                        } else if (error.status === 500) {
                            message = 'Произошла ошибка на сервере. Обратитесь в техподдержку'
                        }
                        return of(AuthActions.loginFailed({ message }))
                    })
                )
            )
        ),
    { functional: true }
)

export const loginSuccessfulRedirect$ = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthActions.loginSuccessful),
            tap(() => router.navigate(['/']))
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
                map(() => AuthActions.logoutSuccessful()),
                catchError((error: { message: string }) => of(AuthActions.logoutFailed({ message: error.message })))
            )
        )
    ),
    { functional: true }
)

export const logoutSuccessfulRedirect$ = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthActions.logoutSuccessful),
            tap(() => router.navigate(['/']))
        ),
    {
        functional: true,
        dispatch: false
    }
)

export const errorOccured$ = createEffect(
    (actions$ = inject(Actions)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
                AuthActions.getAuthStatusFailed,
                AuthActions.logoutFailed
            ),
            tap(action => {
                if (action.message)
                    snackBar.open(action.message, 'Закрыть', {
                        duration: 3000
                    });
            })
        )
    },
    {
        functional: true,
        dispatch: false
    }
)