import { ObjectId } from "mongodb";

export enum Scopes {
    Admin = 'admin',
    HR = 'hr',
    User = 'user'
}

export interface IDbUser {
    _id: ObjectId,
    email: string,
    hashed_password: Buffer,
    salt: Buffer,
    scope: Scopes
}