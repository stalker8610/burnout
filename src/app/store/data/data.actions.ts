import { TObjectId } from '../../../models/common.model';
import { createAction, props } from "@ngrx/store";
import { ICompany } from '@models/company.model';
import { TCompanyStructure } from 'src/app/services/data.service';
import { IRespondent } from '@models/respondent.model';
import { IDepartment } from '@models/department.model';
import { TWithId } from '@models/common.model';

enum EDataActions {
    
    LoadDataRequested = '[Company Structure Page] Load Company Structure Requested',
    LoadData = '[Company Structure Page] Load Company Structure',
    LoadDataFailed = '[Data API] Load Company Structure Failed',
    LoadDataSuccessful = '[Data API] Load Company Structure Successful',
    ReleaseData = '[Logout] Release Data',

    AddDepartment = '[Company Structure Page] Add Department',
    AddDepartmentSuccessful = '[Data API] Add Department Successful',
    AddDepartmentFailed = '[Data API] Add Department Failed',

    AddRespondent = '[Company Structure Page] Add Respondent',
    AddRespondentSuccessful = '[Data API] Add Respondent Successful',
    AddRespondentFailed = '[Data API] Add Respondent Failed',

    addDepartmentWithRespondent = '[Company Structure Page] Add Department With Respondent',
}

export type TNewRespondent = Pick<IRespondent, 'lastName' | 'firstName' | 'middleName' | 'scope'> & ({ departmentId: TObjectId<IDepartment> } | { title: string })

export const loadRequested = createAction(
    EDataActions.LoadDataRequested
)

export const load = createAction(
    EDataActions.LoadData,
    props<{ companyId: TObjectId<ICompany> }>()
)

export const loadFailed = createAction(
    EDataActions.LoadDataFailed,
    props<{ error: string }>()
)

export const loadSuccessful = createAction(
    EDataActions.LoadDataSuccessful,
    props<TCompanyStructure>()
)

export const releaseData = createAction(
    EDataActions.ReleaseData
)

export const addDepartment = createAction(
    EDataActions.AddDepartment,
    props<IDepartment>()
)

export const addDepartmentSuccessful = createAction(
    EDataActions.AddDepartmentSuccessful,
    props<TWithId<IDepartment>>()
)

export const addDepartmentFailed = createAction(
    EDataActions.AddDepartmentFailed,
    props<{ error: string }>()
)

export const addRespondent = createAction(
    EDataActions.AddRespondent,
    props<IRespondent>()
)

export const addRespondentSuccessful = createAction(
    EDataActions.AddRespondentSuccessful,
    props<TWithId<IRespondent>>()
)

export const addRespondentFailed = createAction(
    EDataActions.AddRespondentFailed,
    props<{ error: string }>()
)

export const addDepartmentWithRespondent = createAction(
    EDataActions.addDepartmentWithRespondent,
    props<{ respondent: IRespondent, department: IDepartment }>()
)