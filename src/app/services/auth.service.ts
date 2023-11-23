import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TObjectId, TWithId } from '@models/common.model';
import { ICompany } from '@models/company.model';
import { IRespondent } from '@models/respondent.model';
import { Scopes } from '@models/user.model';
import { IUser } from '@models/user.model';

export type TLoginResult = {
    _id: TObjectId<IUser>,
    email: string,
    companyId: TObjectId<ICompany>,
    respondentId: TObjectId<IRespondent>,
    scope: Scopes,
    respondent: TWithId<IRespondent>
}

type TSignupResult = {}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpClient: HttpClient) { }

    public getMe() {
        return this.httpClient.get<TLoginResult | null>('/api/auth/me')
    }

    public logIn(email: string, password: string) {
        return this.httpClient.post<TLoginResult>('/api/auth/login', { email, password })

    }

    public logOut() {
        return this.httpClient.post('/api/auth/logout', {}, { responseType: 'text' });
    }

    public signUp(token: string, password: string) {
        return this.httpClient.post<TSignupResult>('/api/auth/signup', { token, password })

    }

    public validateToken(token: string) {
        return this.httpClient.get(`/api/tokens/validate/${token}`, { responseType: 'text' })

    }

}


