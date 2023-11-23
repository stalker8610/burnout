import { TObjectId, TWithId } from "./common.model"
import { IDepartment } from "./department.model"
import { IRespondent } from "./respondent.model"

export interface ICompany{
    name: string,
}

export type TCompanyStructure = {
    _id: TObjectId<ICompany>,
    departments: TWithId<IDepartment>[],
    team: TWithId<IRespondent>[]
}