import { MatButtonModule } from '@angular/material/button';
import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [MatInputModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
    standalone: true
})
export class LoginComponent {

    @Output('login') loginEvent = new EventEmitter<{ email: string, password: string }>()

    loginGroup = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    })

    login() {
        this.loginEvent.emit(this.loginGroup.getRawValue());
    }

}
