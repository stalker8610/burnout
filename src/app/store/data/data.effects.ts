import { TLoginResult } from 'src/app/services/auth.service';
import { createEffect } from "@ngrx/effects"
import { DataService, TCompanyStructure } from "../../services/data.service"
import { Actions, ofType } from "@ngrx/effects"
import * as DataActions from './data.actions'
import * as AuthActions from '../auth/auth.actions'
import { map, catchError, exhaustMap, of, withLatestFrom, filter } from "rxjs"
import { inject } from '@angular/core';
import { IDepartment } from "@models/department.model"
import { TWithId } from "@models/common.model"
import { IRespondent } from '@models/respondent.model';
import { getAuthorizedUser } from "../auth/auth.selectors"
import { Store } from "@ngrx/store"

/* export const loginSuccessful$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(AuthActions.loginSuccessful),
            map(({ companyId }) => DataActions.load({ companyId }))
        ),
    { functional: true }
) */
ОСТАНОВИЛСЯ ТУТ
export const loadDataRequested$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.loadRequested),
            withLatestFrom(store.select(getAuthorizedUser)),
            filter(([action, user]) => !!user),
            exhaustMap(([action, user]) => dataService.loadData(user!.companyId)
                .pipe(
                    map((data: TCompanyStructure) => DataActions.loadSuccessful(data)),
                    catchError((error: { message: string }) => of(DataActions.loadFailed({ error: error.message })))
                )
            )
        ),
    { functional: true }
)


export const loadData$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.load),
            exhaustMap(({ companyId }) => dataService.loadData(companyId)
                .pipe(
                    map((data: TCompanyStructure) => DataActions.loadSuccessful(data)),
                    catchError((error: { message: string }) => of(DataActions.loadFailed({ error: error.message })))
                )
            )
        ),
    { functional: true }
)

export const logout$ = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(AuthActions.logoutSuccessful),
            exhaustMap(() => of(DataActions.releaseData()))
        ),
    { functional: true }
)

export const addDepartment$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.addDepartment),
            exhaustMap((data: IDepartment) =>
                dataService.addDepartment(data.companyId, data)
                    .pipe(
                        map((data: TWithId<IDepartment>) => DataActions.addDepartmentSuccessful(data)),
                        catchError((error: { message: string }) => of(DataActions.addDepartmentFailed({ error: error.message })))
                    )
            )
        ),
    { functional: true }
)

export const addRespondent = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.addRespondent),
            exhaustMap((data: IRespondent) =>
                dataService.addRespondent(data.companyId, data)
                    .pipe(
                        map((data: TWithId<IRespondent>) => DataActions.addRespondentSuccessful(data)),
                        catchError((error: { message: string }) => of(DataActions.addRespondentFailed({ error: error.message })))
                    )
            )
        ),
    { functional: true }
)

export const addDepartmentAndRespondent = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.addDepartmentWithRespondent),
            exhaustMap((data: { respondent: IRespondent, department: IDepartment }) =>
                dataService.addDepartment(data.department.companyId, data.department)
                    .pipe(
                        map((createdDepartment: TWithId<IDepartment>) => {
                            const respondent: IRespondent = {
                                ...data.respondent,
                                departmentId: createdDepartment._id
                            }
                            return DataActions.addRespondent(respondent)
                        }),
                        catchError((error: { message: string }) => of(DataActions.addDepartmentFailed({ error: error.message })))
                    )

            )
        ),
    { functional: true }
)