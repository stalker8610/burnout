import { createAction, props } from "@ngrx/store";
import { ICompany } from '@models/company.model';
import { TCompanyStructure } from 'src/app/services/data.service';
import { IRespondent } from '@models/respondent.model';
import { IDepartment } from '@models/department.model';
import { TWithId, TObjectId } from '@models/common.model';

enum EDataActions {

    LoadDataRequested = '[Company Structure Page] Load Company Structure Requested',
    LoadData = '[Company Structure Page] Load Company Structure',
    LoadDataFailed = '[Data API] Load Company Structure Failed',
    LoadDataSuccessful = '[Data API] Load Company Structure Successful',
    ReleaseData = '[Logout] Release Data',

    AddDepartment = '[Company Structure Page] Add Department',
    AddDepartmentSuccessful = '[Data API] Add Department Successful',
    AddDepartmentFailed = '[Data API] Add Department Failed',

    AddRespondentRequest = '[Company Structure Page] Add Respondent Request',

    AddRespondent = '[Data API] Add Respondent',
    AddRespondentSuccessful = '[Data API] Add Respondent Successful',
    AddRespondentFailed = '[Data API] Add Respondent Failed',

    AddDepartmentWithRespondent = '[Company Structure Page] Add Department With Respondent',

    RemoveRespondent = '[Company Structure Page] Remove Respondent',
    RemoveRespondentSuccessful = '[Data API] Remove Respondent Successful',
    RemoveRespondentFailed = '[Data API] Remove Respondent Failed',

    RemoveDepartment = '[Company Structure Page] Remove Department',
    RemoveDepartmentSuccessful = '[Data API] Remove Department Successful',
    RemoveDepartmentFailed = '[Data API] Remove Department Failed',


    PatchRespondent = '[Company Structure Page] Patch Respondent',
    PatchRespondentSuccessful = '[Data API] Patch Respondent Successful',
    PatchRespondentFailed = '[Data API] Patch Respondent Failed',

    PatchDepartment = '[Company Structure Page] Patch Department',
    PatchDepartmentSuccessful = '[Data API] Patch Department Successful',
    PatchDepartmentFailed = '[Data API] Patch Department Failed',

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
    props<{ message: string }>()
)

export const loadSuccessful = createAction(
    EDataActions.LoadDataSuccessful,
    props<{ data: TCompanyStructure }>()
)

export const releaseData = createAction(
    EDataActions.ReleaseData
)

export const addDepartment = createAction(
    EDataActions.AddDepartment,
    props<{ department: IDepartment }>()
)

export const addDepartmentSuccessful = createAction(
    EDataActions.AddDepartmentSuccessful,
    props<{ department: TWithId<IDepartment>, message: string }>()
)

export const addDepartmentFailed = createAction(
    EDataActions.AddDepartmentFailed,
    props<{ message: string }>()
)


interface NewRespondentBase {
    name: string,
    email: string,
}

interface INewRespondentWithExistDepartment extends NewRespondentBase {
    departmentId: TObjectId<IDepartment>
}

interface INewRespondentWithDepartmentToCreate extends NewRespondentBase {
    newDepartmentTitle: IDepartment['title']
}

export type TNewResponentToCreate = INewRespondentWithExistDepartment | INewRespondentWithDepartmentToCreate;

export const addRespondentRequest = createAction(
    EDataActions.AddRespondentRequest,
    props<{ respondent: TNewResponentToCreate }>()
)

export const addRespondent = createAction(
    EDataActions.AddRespondent,
    props<{ respondent: IRespondent }>()
)

export const addRespondentSuccessful = createAction(
    EDataActions.AddRespondentSuccessful,
    props<{ respondent: TWithId<IRespondent>, message: string }>()
)

export const addRespondentFailed = createAction(
    EDataActions.AddRespondentFailed,
    props<{ message: string }>()
)

export const addDepartmentWithRespondent = createAction(
    EDataActions.AddDepartmentWithRespondent,
    props<{ respondent: IRespondent, department: IDepartment }>()
)

export const removeRespondent = createAction(
    EDataActions.RemoveRespondent,
    props<Pick<TWithId<IRespondent>, '_id'>>()
)

export const removeRespondentSuccessful = createAction(
    EDataActions.RemoveRespondentSuccessful,
    props<{ respondentId: TObjectId<IRespondent>, message: string }>()
)

export const removeRespondentFailed = createAction(
    EDataActions.RemoveRespondentFailed,
    props<{ respondentId: TObjectId<IRespondent>, message: string }>()
)

export const removeDepartment = createAction(
    EDataActions.RemoveDepartment,
    props<Pick<TWithId<IDepartment>, '_id'>>()
)

export const removeDepartmentSuccessful = createAction(
    EDataActions.RemoveRespondentSuccessful,
    props<{ departmentId: TObjectId<IDepartment>, message: string }>()
)

export const removeDepartmentFailed = createAction(
    EDataActions.RemoveRespondentFailed,
    props<{ departmentId: TObjectId<IDepartment>, message: string }>()
)

export const patchRespondent = createAction(
    EDataActions.PatchRespondent,
    props<{ respondent: TWithId<Partial<IRespondent>> }>()
)

export const patchRespondentSuccessful = createAction(
    EDataActions.PatchRespondentSuccessful,
    props<{ respondent: TWithId<IRespondent>, message: string }>()
)

export const patchRespondentFailed = createAction(
    EDataActions.PatchRespondentFailed,
    props<{ respondent: TWithId<Partial<IRespondent>>, message: string }>()
)

export const patchDepartment = createAction(
    EDataActions.PatchDepartment,
    props<{ department: TWithId<Partial<IDepartment>> }>()
)

export const patchDepartmentSuccessful = createAction(
    EDataActions.PatchDepartmentSuccessful,
    props<{ department: TWithId<IDepartment>, message: string }>()
)

export const patchDepartmentFailed = createAction(
    EDataActions.PatchDepartmentFailed,
    props<{ department: TWithId<Partial<IDepartment>>, message: string }>()
)