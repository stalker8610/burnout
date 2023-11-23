import { Scopes } from "../models/user.model.js"
import { TObjectId, IWithCompanyId } from "./common.model.js"
import { IDepartment } from "./department.model.js"

export enum SignUpStatus {
    NotInvitedYet = 'NotInvitedYet',
    Invited = 'Invited',
    SingedUp = 'SignedUp',
    Disabled = 'Disabled'
}

export type INewRespondent = Omit<IRespondent, 'signUpStatus'>


export interface IRespondent extends IWithCompanyId  {
    firstName: string,
    lastName: string,
    middleName?: string,
    email: string,
    birthDate?: string, // ISO date string
    departmentId?: TObjectId<IDepartment>,
    position?: string,
    isRemote?: boolean,
    doSendSurveys?: boolean,
    scope: Scopes,
    signUpStatus: SignUpStatus,
}