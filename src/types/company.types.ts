
import { Scopes } from "./access.types.js"

export enum SignUpStatus {
    NotInvitedYet,
    Invited,
    SingedUp
}

export interface ICompany {
    name: string,
}

export interface IDepartment {
    company: ICompany,
    title: string,
    chief: IUser
    subDepartments: IDepartment[],
}

export interface IUser {
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    birthDate: Date,
    department: IDepartment,
    position: string,
    isRemote: boolean,
    isActive: boolean,
    doSendSurveys: boolean,
    scope: Scopes,
    signUpStatus: SignUpStatus 
}