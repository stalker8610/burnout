import { AuthActions } from 'src/app/store/auth/auth.actions';
import * as DataActions from './data/data.actions'
import * as SurveyActions from './survey/survey.actions'
import { createEffect } from "@ngrx/effects"
import { inject } from '@angular/core'
import { Actions, ofType } from "@ngrx/effects"
import { MatSnackBar } from "@angular/material/snack-bar"
import { tap } from "rxjs"

export const errorOccured$ = createEffect(
    (actions$ = inject(Actions)) => {
        const snackBar = inject(MatSnackBar);
        return actions$.pipe(
            ofType(
                AuthActions.getAuthStatusFailed,
                AuthActions.loginFailed,
                AuthActions.logoutFailed,
                AuthActions.inviteFailed,
                AuthActions.validateTokenFailed,
                AuthActions.signupFailed,

                DataActions.addDepartmentFailed,
                DataActions.addRespondentFailed,
                DataActions.loadFailed,
                DataActions.patchDepartmentFailed,
                DataActions.patchRespondentFailed,
                DataActions.removeDepartmentFailed,
                DataActions.removeRespondentFailed,

                SurveyActions.loadFailed,
                SurveyActions.operationFailed,
                SurveyActions.surveyCompleteFailed
                
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

export const doneSuccessful$ = createEffect(
    (actions$ = inject(Actions)) => {
        const snackBar = inject(MatSnackBar);
        return actions$.pipe(
            ofType(
                AuthActions.inviteSuccessful,
                AuthActions.signupSuccessful,

                DataActions.addDepartmentSuccessful,
                DataActions.addRespondentSuccessful,
                DataActions.patchDepartmentSuccessful,
                DataActions.patchRespondentSuccessful,
                DataActions.removeDepartmentSuccessful,
                DataActions.removeRespondentSuccessful,
                DataActions.deactivateRespondentSuccessful

            ),
            tap(action => {
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