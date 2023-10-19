import { Scopes } from "../models/user.model.js"
import { TObjectId, IWithCompanyId } from "./common.model.js"
import { IDepartment } from "./department.model.js"

export enum SignUpStatus {
    NotInvitedYet = 'NotInvitedYet',
    Invited = 'Invited',
    SingedUp = 'SignedUp'
}

export interface IRespondent extends IWithCompanyId  {
    firstName: string,
    lastName: string,
    middleName?: string,
    email: string,
    birthDate?: Date,
    departmentId?: TObjectId<IDepartment>,
    position?: string,
    isRemote?: boolean,
    isActive?: boolean,
    doSendSurveys?: boolean,
    scope?: Scopes,
    signUpStatus?: SignUpStatus,
}