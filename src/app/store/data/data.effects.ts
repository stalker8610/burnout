import { createEffect } from "@ngrx/effects"
import { DataService, TCompanyStructure } from "../../services/data.service"
import { Actions, ofType } from "@ngrx/effects"
import * as DataActions from './data.actions'
import * as AuthActions from '../auth/auth.actions'
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core'
import { IDepartment } from "@models/department.model"
import { TObjectId, TWithId } from "@models/common.model"
import { IRespondent } from '@models/respondent.model';
import { getAuthorizedUser } from "../auth/auth.selectors"
import { ActionCreator, Store } from "@ngrx/store"
import { getCompanyId, getLoaded } from './data.selectors'
import { concatLatestFrom } from "@ngrx/effects"
import { Scopes } from "@models/user.model"
import { MatSnackBar } from "@angular/material/snack-bar"

import { parseName, concatRespondentName } from "./data.util"

interface IBackendError {
    error: string,
    message: string
}

export const loadDataRequested$ = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.loadRequested),
            concatLatestFrom(() => store.select(getAuthorizedUser)),
            concatLatestFrom(() => store.select(getLoaded)),
            filter(([[action, user], loaded]) => !!user && !loaded),
            exhaustMap(([[action, user], loaded]) => of(DataActions.load({ companyId: user!.companyId })))
        ),
    { functional: true }
)

export const loadData$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.load),
            exhaustMap(({ companyId }) => dataService.loadData(companyId)
                .pipe(
                    map((data: TCompanyStructure) => DataActions.loadSuccessful({ data })),
                    catchError(handleError(DataActions.loadFailed))
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
            exhaustMap((action: { department: IDepartment }) => dataService.addDepartment(action.department.companyId, action.department)
                .pipe(
                    map((department: TWithId<IDepartment>) =>
                        DataActions.addDepartmentSuccessful({ department, message: `Отдел ${action.department.title} добавлен` })),
                    catchError(handleError(DataActions.addDepartmentFailed))
                )
            )
        ),
    { functional: true }
)


export const addRespondentRequest$ = createEffect(
    (actions$ = inject(Actions), store = inject(Store), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.addRespondentRequest),
            concatLatestFrom(() => store.select(getCompanyId)),
            filter(([action, companyId]) => !!companyId),
            exhaustMap(([action, companyId]) => {

                const nameParts = parseName(action.respondent.name);
                const newRespondent: IRespondent = Object.assign({},
                    nameParts,
                    {
                        companyId: companyId!,
                        email: action.respondent.email,
                        scope: Scopes.User,
                    })

                if ('newDepartmentTitle' in action.respondent) {
                    const newDepartment: IDepartment = {
                        companyId: companyId!,
                        title: action.respondent.newDepartmentTitle
                    }
                    return of(DataActions.addDepartmentWithRespondent({ respondent: newRespondent, department: newDepartment }));
                } else {
                    newRespondent.departmentId = action.respondent.departmentId
                    return of(DataActions.addRespondent({ respondent: newRespondent }));
                }
            })),
    { functional: true }
)

export const addRespondent$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.addRespondent),
            exhaustMap((action: { respondent: IRespondent }) =>
                dataService.addRespondent(action.respondent.companyId, action.respondent)
                    .pipe(
                        map((respondent: TWithId<IRespondent>) =>
                            DataActions.addRespondentSuccessful({ respondent, message: `Сотрудник ${concatRespondentName(action.respondent)} добавлен` })),
                        catchError(handleError(DataActions.addRespondentFailed))
                    )
            )
        ),
    { functional: true }
)

export const addDepartmentAndRespondent = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService)) =>
        actions$.pipe(
            ofType(DataActions.addDepartmentWithRespondent),
            exhaustMap((action: { respondent: IRespondent, department: IDepartment }) =>
                dataService.addDepartment(action.department.companyId, action.department).pipe(
                    exhaustMap((department: TWithId<IDepartment>) => {
                        const respondent: IRespondent = {
                            ...action.respondent,
                            departmentId: department._id
                        }
                        return [
                            DataActions.addDepartmentSuccessful({ department, message: `Отдел ${action.department.title} добавлен` }),
                            DataActions.addRespondent({ respondent })
                        ]
                    }),
                    catchError(handleError(DataActions.addDepartmentFailed))
                ))
        ),
    { functional: true }
)


export const removeRespondent$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.removeRespondent),
            concatLatestFrom(() => store.select(getCompanyId)),
            filter(([respondent, companyId]) => !!companyId),
            exhaustMap(([respondent, companyId]) => dataService.removeRespondent(companyId!, respondent._id)
                .pipe(
                    map(data => DataActions.removeRespondentSuccessful({ respondentId: data._id, message: `Сотрудник удален` })),
                    catchError(handleError(DataActions.removeRespondentFailed))
                )
            )
        ),
    { functional: true }
)

export const removeDepartment$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.removeDepartment),
            concatLatestFrom(() => store.select(getCompanyId)),
            filter(([department, companyId]) => !!companyId),
            exhaustMap(([department, companyId]) => dataService.removeDepartment(companyId!, department._id)
                .pipe(
                    map(data => DataActions.removeDepartmentSuccessful({ departmentId: department._id, message: `Отдел удален` })),
                    catchError(handleError(DataActions.removeDepartmentFailed))
                )
            )
        ),

    { functional: true }
)


export const patchRespondent$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.patchRespondent),
            concatLatestFrom(() => store.select(getCompanyId)),
            filter(([action, companyId]) => !!companyId),
            exhaustMap(([action, companyId]) => dataService.patchRespondent(companyId!, action.respondent)
                .pipe(
                    map(data => DataActions.patchRespondentSuccessful({ respondent: data, message: `Изменения применены` })),
                    catchError(handleError(DataActions.patchRespondentFailed))
                )
            )
        ),
    { functional: true }
)


export const patchDepartment$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.patchDepartment),
            concatLatestFrom(() => store.select(getCompanyId)),
            filter(([action, companyId]) => !!companyId),
            exhaustMap(([action, companyId]) => dataService.patchDepartment(companyId!, action.department)
                .pipe(
                    map(data => DataActions.patchDepartmentSuccessful({ department: data, message: `Изменения применены` })),
                    catchError(handleError(DataActions.patchDepartmentFailed))
                )
            )
        ),
    { functional: true }
)

export const errorOccured$ = createEffect(
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
                DataActions.addDepartmentFailed,
                DataActions.addRespondentFailed,
                DataActions.loadFailed,
                DataActions.patchDepartmentFailed,
                DataActions.patchRespondentFailed,
                DataActions.removeDepartmentFailed,
                DataActions.removeRespondentFailed
            ),
            tap(action => {
                /* console.log('error catched', action.message); */
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
    (actions$ = inject(Actions), dataService = inject(DataService), store = inject(Store)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
                DataActions.addDepartmentSuccessful,
                DataActions.addRespondentSuccessful,
                DataActions.patchDepartmentSuccessful,
                DataActions.patchRespondentSuccessful,
                DataActions.removeDepartmentSuccessful,
                DataActions.removeRespondentSuccessful
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



const handleError = (actionCreator: any, message?: string) => {
    return (error: IBackendError) => of(actionCreator({ error: message || error.error || error.message }))
}

