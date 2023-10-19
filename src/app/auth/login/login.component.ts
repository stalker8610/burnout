import { Component, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    public email = new FormControl('', { validators: [Validators.required, Validators.email] });
    public password = new FormControl('', { validators: [Validators.required]});

    constructor(private readonly authService: AuthService) { }

    auth() {
        /* this.authService.login(this.email.value!, this.password.value!); */
    }

}
