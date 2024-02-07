import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ICompany, TCompanyStructure } from "@models/company.model";
import { TObjectId, IWithMessage, TWithId } from "@models/common.model";
import { IDepartment } from "@models/department.model";
import { INewRespondent, IRespondent } from "@models/respondent.model";


export const DataActions = createActionGroup({
    source: 'Data API',
    events: {
        loadRequested: emptyProps(),
        load: props<{ companyId: TObjectId<ICompany> }>(),
        loadFailed: props<IWithMessage>(),
        loadSuccessful: props<{ data: TCompanyStructure }>(),

        releaseData: emptyProps(),

        addDepartment: props<{ department: IDepartment }>(),
        addDepartmentSuccessful: props<{ department: TWithId<IDepartment> } & IWithMessage>(),
        addDepartmentFailed: props<IWithMessage>(),

        addRespondentRequest: props<{ respondent: TNewResponentToCreate }>(),
        addRespondent: props<{ respondent: INewRespondent }>(),
        addRespondentSuccessful: props<{ respondent: TWithId<IRespondent> } & IWithMessage>(),
        addRespondentFailed: props<IWithMessage>(),
        addDepartmentWithRespondent: props<{ respondent: INewRespondent, department: IDepartment }>(),

        removeRespondent: props<Pick<TWithId<IRespondent>, '_id'>>(),
        deactivateRespondentSuccessful: props<{ respondent: TWithId<IRespondent> } & IWithMessage>(),
        removeRespondentSuccessful: props<{ respondentId: TObjectId<IRespondent> } & IWithMessage>(),
        removeRespondentFailed: props<{ respondentId: TObjectId<IRespondent> } & IWithMessage>(),

        removeDepartment: props<Pick<TWithId<IDepartment>, '_id'>>(),
        removeDepartmentSuccessful: props<{ departmentId: TObjectId<IDepartment> } & IWithMessage>(),
        removeDepartmentFailed: props<{ departmentId: TObjectId<IDepartment> } & IWithMessage>(),

        patchRespondent: props<{ respondent: TWithId<Partial<IRespondent>> }>(),
        patchRespondentSuccessful: props<{ respondent: TWithId<IRespondent> } & IWithMessage>(),
        patchRespondentFailed: props<{ respondent: TWithId<Partial<IRespondent>> } & IWithMessage>(),

        patchDepartment: props<{ department: TWithId<Partial<IDepartment>> }>(),
        patchDepartmentSuccessful: props<{ department: TWithId<IDepartment> } & IWithMessage>(),
        patchDepartmentFailed: props<{ department: TWithId<Partial<IDepartment>> } & IWithMessage>(),
    }
});

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





