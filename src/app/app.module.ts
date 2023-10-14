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


import { AppRoutingModule } from './routing/router.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { QuestionCardComponent } from './question-card/question-card.component';
import { MoodQuestionCardComponent } from './mood-question-card/mood-question-card.component';
import { AssertionQuestionCardComponent } from './assertion-question-card/assertion-question-card.component';
import { QuestionDirective } from './question.directive';
import { SurveyComponent } from './survey/survey.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotFoundComponent,
        SignupComponent,
        UsersComponent,
        HomeComponent,
        QuestionCardComponent,
        MoodQuestionCardComponent,
        AssertionQuestionCardComponent,
        QuestionDirective,
        SurveyComponent
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
        MatCheckboxModule
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
