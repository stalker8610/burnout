import { TObjectId, IWithCompanyId } from "./common.model.js"
import { IRespondent } from "./respondent.model.js";

export enum Scopes {
    Admin = 'Admin',
    HR = 'HR',
    User = 'User'
}

export interface IUser extends IWithCompanyId {
    email: string,
    scope: Scopes,
    respondentId: TObjectId<IRespondent>
}