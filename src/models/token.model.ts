import { TObjectId } from "./common.model.js"
import { IRespondent } from "./respondent.model.js";
import { IUser } from "./user.model.js";
import { Scopes } from "./user.model.js"

export interface ISignupToken {
    respondentId: TObjectId<IRespondent>,
    scope: Scopes,
    userId?: TObjectId<IUser> //filled when user signed up with token
}