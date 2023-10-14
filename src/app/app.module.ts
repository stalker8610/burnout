import { NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { AppRoutingModule } from './routing/router.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotFoundComponent,
        SignupComponent,
        UsersComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule
    ],
    providers: [
        {
            provide: MAT_RIPPLE_GLOBAL_OPTIONS,
            useValue: {
                disabled: true
            }
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                hideRequiredMarker: true
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
