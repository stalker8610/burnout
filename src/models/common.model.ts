
import { ICompany } from "./company.model.js";

// HEX string of 24 bytes
export type TObjectId<T> = string;

export type TWithId<T> = T & {
    _id: TObjectId<T>
}

export type TWithData<T, K, PropertyName extends string> = T & {
    [P in PropertyName]: K
}

export interface IWithCompanyId {
    companyId: TObjectId<ICompany>
}

export interface IWithMessage {
    message: string
}