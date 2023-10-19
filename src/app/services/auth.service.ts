import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpClient: HttpClient) { }

    /* public isAuthenticated(): Boolean {
        let userData = localStorage.getItem('userInfo')
        if (userData && JSON.parse(userData)) {
            return true;
        }
        return false;
    } */

    public logIn(email: string, password: string) {
        return this.httpClient.post('/api/auth/login', { email, password }, { responseType: 'text' })
            .pipe(catchError(this.handleError));
    }

    /* public setUserInfo(user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
    } */

    public signUp(token: string, password: string) {
        return this.httpClient.post('/api/auth/signup', { token, password }, { responseType: 'text' })
            .pipe(catchError(this.handleError));
    }

    public validateToken(token: string) {
        return this.httpClient.get(`/api/tokens/validate/${token}`, { responseType: 'text' })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.error));
    }

}


