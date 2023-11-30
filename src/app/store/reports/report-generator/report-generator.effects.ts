import { createEffect } from "@ngrx/effects"
import { Actions, ofType } from "@ngrx/effects"
import { concatLatestFrom } from "@ngrx/effects"
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core'
import { Store } from "@ngrx/store"
import { ReportService } from "src/app/services/report.service"

import { createSelectors } from "./report-generator.selectors"
import { handleError } from "../../error.handler"

import { MatSnackBar } from "@angular/material/snack-bar"
import { reportActions } from "./report-generator.actions"
import { Observable } from "rxjs"



export const createEffects = <T, K>(ReportActions: ReturnType<typeof reportActions<T, K>>, selectors: ReturnType<typeof createSelectors<T>>, reportDataLoader: (reportService: ReportService, query: K) => Observable<T>) => {

    return {
        reportRequested$: createEffect(
            (actions$ = inject(Actions), store = inject(Store)) =>
                actions$.pipe(
                    ofType(ReportActions.reportRequested),
                    concatLatestFrom(() => store.select(selectors.getLoaded)),
                    filter(([action, loaded]) => !loaded),
                    exhaustMap(([action, loaded]) => of(ReportActions.reportLoad(action)))
                ),
            { functional: true }
        ),


        reportLoad$: createEffect(
            (actions$ = inject(Actions), reportService = inject(ReportService)) =>
                actions$.pipe(
                    ofType(ReportActions.reportLoad),
                    exhaustMap(action => reportDataLoader(reportService, action.query)
                        .pipe(
                            map(data => ReportActions.reportLoadSuccessful({ data })),
                            catchError(handleError(ReportActions.reportLoadFailed))
                        ))
                ),
            { functional: true }
        ),

        errorOccured$: createEffect(
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

    }
}
