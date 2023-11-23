import { createEffect } from "@ngrx/effects"
import { Actions, ofType } from "@ngrx/effects"
import * as ReportActions from './report-wall.actions'
import { concatLatestFrom } from "@ngrx/effects"
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core'
import { Store } from "@ngrx/store"
import { ReportService } from "src/app/services/report.service"

import { getLoaded } from "./report-wall.selectors"
import { handleError } from "../../error.handler"

import { MatSnackBar } from "@angular/material/snack-bar"

export const reportRequested$ = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(ReportActions.reportRequested),
            concatLatestFrom(() => store.select(getLoaded)),
            filter(([action, loaded]) => !loaded),
            exhaustMap(([action, loaded]) => of(ReportActions.reportLoad(action)))
        ),
    { functional: true }
)

export const reportLoad$ = createEffect(
    (actions$ = inject(Actions), reportService = inject(ReportService)) =>
        actions$.pipe(
            ofType(ReportActions.reportLoad),
            exhaustMap(action => reportService.getReportWall(action.companyId)
                .pipe(
                    map(data => ReportActions.reportLoadSuccessful({ data })),
                    catchError(handleError(ReportActions.reportLoadFailed))
                ))
        ),
    { functional: true }
)

export const errorOccured$ = createEffect(
    (actions$ = inject(Actions)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
                ReportActions.reportLoadFailed,
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


/* export const doneSuccessful$ = createEffect(
    (actions$ = inject(Actions)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
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
) */


