import { NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { AppRoutingModule } from './routing/router.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { QuestionCardContainerComponent } from './cards/question-card-container/question-card-container.component';
import { QuestionCardWallComponent } from './cards/question-card-wall/question-card-wall.component';
import { QuestionCardCompanyComponent } from './cards/question-card-company/question-card-company.component';
import { QuestionDirective } from './cards/question.directive';
import { SurveyComponent } from './survey/survey.component';
import { QuestionCardTeamAssertCheckboxComponent } from './cards/question-card-team-assert-checkbox/question-card-team-assert-checkbox.component';
import { QuestionCardPersonalComponent } from './cards/question-card-personal/question-card-personal.component';
import { QuestionCardTeamAssertBooleanComponent } from './cards/question-card-team-assert-boolean/question-card-team-assert-boolean.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotFoundComponent,
        SignupComponent,
        UsersComponent,
        HomeComponent,
        QuestionCardContainerComponent,
        QuestionCardWallComponent,
        QuestionCardCompanyComponent,
        QuestionDirective,
        SurveyComponent,
        QuestionCardTeamAssertCheckboxComponent,
        QuestionCardPersonalComponent,
        QuestionCardTeamAssertBooleanComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        TextFieldModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ],
    providers: [
        {
            provide: MAT_RIPPLE_GLOBAL_OPTIONS,
            useValue: {
                disabled: false
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
