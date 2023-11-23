
import { createEffect } from "@ngrx/effects"
import { DataService } from "../../services/data.service"
import { Actions, ofType } from "@ngrx/effects"
import * as DataActions from './data.actions'
import * as AuthActions from '../auth/auth.actions'
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core'
import { IDepartment } from "@models/department.model"
import { TWithId } from "@models/common.model"
import { IRespondent, INewRespondent, SignUpStatus } from '@models/respondent.model';
import { getAuthorizedUser } from "../auth/auth.selectors"
import { Store } from "@ngrx/store"
import { getCompanyId, getLoaded, getRespondent } from './data.selectors'
import { concatLatestFrom } from "@ngrx/effects"
import { Scopes } from "@models/user.model"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TCompanyStructure } from "@models/company.model"
import { handleError } from "../error.handler"

import { parseName, concatRespondentName } from "./data.util"

export const loadDataRequested$ = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.loadRequested),
            concatLatestFrom(() => [
                store.select(getAuthorizedUser),
                store.select(getLoaded)]),
            filter(([action, user, loaded]) => !!user && !loaded),
            exhaustMap(([action, user, loaded]) => of(DataActions.load({ companyId: user!.companyId })))
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
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(DataActions.addRespondentRequest),
            concatLatestFrom(() => store.select(getCompanyId)),
            filter(([action, companyId]) => !!companyId),
            exhaustMap(([action, companyId]) => {

                const nameParts = parseName(action.respondent.name);
                const newRespondent: INewRespondent = Object.assign({},
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
            exhaustMap((action: { respondent: INewRespondent }) =>
                dataService.addRespondent(action.respondent.companyId, action.respondent)
                    .pipe(
                        map((respondent: TWithId<IRespondent>) =>
                            DataActions.addRespondentSuccessful({ respondent, message: `Сотрудник ${concatRespondentName(respondent)} добавлен` })),
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
            exhaustMap((action: { respondent: INewRespondent, department: IDepartment }) =>
                dataService.addDepartment(action.department.companyId, action.department).pipe(
                    exhaustMap((department: TWithId<IDepartment>) => {
                        const respondent: INewRespondent = {
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
            concatLatestFrom((respondent) => [
                store.select(getCompanyId),
                store.select(getRespondent(respondent._id))]),
            exhaustMap(([respondent, companyId, respondentData]) => {
                if (respondentData?.signUpStatus === SignUpStatus.SingedUp) {
                    return dataService.deactivateRespondent(companyId!, respondent._id).pipe(
                        map(data => DataActions.deactivateRespondentSuccessful({ respondent: data, message: `Учетная запись деактивирована` })),
                        catchError(handleError(DataActions.removeRespondentFailed))
                    )
                } else {
                    return dataService.removeRespondent(companyId!, respondent._id).pipe(
                        map(data => DataActions.removeRespondentSuccessful({ respondentId: data._id, message: `Учетная запись удалена` })),
                        catchError(handleError(DataActions.removeRespondentFailed))
                    )
                }
            })),
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
    (actions$ = inject(Actions)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
                DataActions.addDepartmentFailed,
                DataActions.addRespondentFailed,
                DataActions.loadFailed,
                DataActions.patchDepartmentFailed,
                DataActions.patchRespondentFailed,
                DataActions.removeDepartmentFailed,
                DataActions.removeRespondentFailed,
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


export const doneSuccessful$ = createEffect(
    (actions$ = inject(Actions)) => {

        const snackBar = inject(MatSnackBar);

        return actions$.pipe(
            ofType(
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





