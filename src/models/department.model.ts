import { TObjectId, IWithCompanyId } from "./common.model.js"
import { IRespondent } from "./respondent.model.js"

export interface IDepartment extends IWithCompanyId {
    title: string,
    chiefId?: TObjectId<IRespondent>,
    parentDepartmentId?: TObjectId<IDepartment>
}

