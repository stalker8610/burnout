import { createEffect } from "@ngrx/effects"
import { AuthService, TLoginResult } from "../../services/auth.service"
import { Actions, ofType } from "@ngrx/effects"
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core';
import { Router } from "@angular/router"
import { getAuthorizedUser, requestDone } from "./auth.selectors"
import { Store } from "@ngrx/store"
import { concatLatestFrom } from "@ngrx/effects"

import { ISignupToken } from "@models/token.model"
import { getRespondent } from "../data/data.selectors"
import { handleError } from "../error.handler"
import { isNotNull } from "../util";

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
                catchError(handleError(AuthActions.getAuthStatusFailed))
            )
        )
    ),
    { functional: true }
)

export const getAuthStatusSuccessfulRedirect$ = createEffect((actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
        ofType(AuthActions.getAuthStatusSuccessful),
        filter(data => !data.user),
        //tap(() => router.navigate(['/login']))
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
                    catchError(handleError(AuthActions.loginFailed, 'Неправильный логин или пароль'))
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
        exhaustMap(() => authService.logOut()
            .pipe(
                map(() => AuthActions.logoutSuccessful()),
                catchError(handleError(AuthActions.logoutFailed))
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

export const invite$ = createEffect((actions$ = inject(Actions), authService = inject(AuthService), store = inject(Store)) =>
    actions$.pipe(
        ofType(AuthActions.invite),
        concatLatestFrom(
            (action) => [
                store.select(getAuthorizedUser).pipe(filter(isNotNull)),
                store.select(getRespondent(action.respondentId)).pipe(filter(isNotNull))
            ]),
        exhaustMap(([action, user, respondent]) => {

            const tokenData: ISignupToken = {
                respondentId: respondent._id,
                scope: respondent.scope
            }

            return authService.invite(tokenData, user!.respondentId)
                .pipe(
                    map(() => AuthActions.inviteSuccessful({ message: 'Приглашение отправлено' })),
                    catchError(handleError(AuthActions.inviteFailed))
                )
        })
    ),
    { functional: true }
)

export const signup$ = createEffect((actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
        ofType(AuthActions.signup),
        exhaustMap((action => authService.signUp(action.token, action.password)
            .pipe(
                map(() => AuthActions.signupSuccessful({ message: 'Учетная запись активирована' })),
                catchError(handleError(AuthActions.signupFailed))
            )
        ))
    ),
    { functional: true }
)

export const validateToken$ = createEffect((actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
        ofType(AuthActions.validateToken),
        exhaustMap((action => authService.validateToken(action.token)
            .pipe(
                map(() => AuthActions.validateTokenSuccessful()),
                catchError(handleError(AuthActions.validateTokenFailed))
            )
        ))
    ),
    { functional: true }
)

export const signupSuccessful$ = createEffect((actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
        ofType(AuthActions.signupSuccessful),
        tap(() => router.navigate(['/']))
    ),
    {
        functional: true,
        dispatch: false
    }
)