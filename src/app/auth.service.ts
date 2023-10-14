import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpClient: HttpClient) { }

    public isAuthenticated(): Boolean {
        let userData = localStorage.getItem('userInfo')
        if (userData && JSON.parse(userData)) {
            return true;
        }
        return false;
    }

    /* public setUserInfo(user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
    } */

    public signUp(email: string, password: string) {
        this.httpClient.post('/api/signup', { email, password, scope: 'HR' })
            .subscribe((data) => {
                console.log(data);
            });
    }

    /* public validate(email, password) {
        return this.httpClient.post('/api/signup', { 'username': email, 'password': password }).toPromise()
    } */

}


