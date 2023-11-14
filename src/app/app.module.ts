import { NgModule, isDevMode } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { AppRoutingModule } from './routing/router.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { QuestionCardContainerComponent } from './cards/question-card-container/question-card-container.component';
import { QuestionCardWallComponent } from './cards/question-card-wall/question-card-wall.component';
import { QuestionCardCompanyComponent } from './cards/question-card-company/question-card-company.component';
import { QuestionDirective } from './cards/question.directive';
import { SurveyComponent } from './survey/survey.component';
import { QuestionCardTeamAssertCheckboxComponent } from './cards/question-card-team-assert-checkbox/question-card-team-assert-checkbox.component';
import { QuestionCardPersonalComponent } from './cards/question-card-personal/question-card-personal.component';
import { QuestionCardTeamAssertBooleanComponent } from './cards/question-card-team-assert-boolean/question-card-team-assert-boolean.component';
import { ReportWallComponent } from './reports/report-wall/report-wall.component';
import { CompanyComponent } from './company/company.component';
import { CompanyTreeComponent } from './company/company-tree/company-tree.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { LoginStatusComponent } from './auth/login-status/login-status.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { authReducer } from './store/auth/auth.reducer';
import { dataReducer } from './store/data/data.reducer';


import * as authEffects from './store/auth/auth.effects';
import * as dataEffects from './store/data/data.effects';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { RespondentComponent } from './company/respondent/respondent.component';
import { DepartmentComponent } from './company/department/department.component';
import { FocusableDirective } from './focusable.directive';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotFoundComponent,
        SignupComponent,
        HomeComponent,
        QuestionCardContainerComponent,
        QuestionCardWallComponent,
        QuestionCardCompanyComponent,
        QuestionDirective,
        SurveyComponent,
        QuestionCardTeamAssertCheckboxComponent,
        QuestionCardPersonalComponent,
        QuestionCardTeamAssertBooleanComponent,
        ReportWallComponent,
        CompanyComponent,
        CompanyTreeComponent,
        LogoutComponent,
        LoginStatusComponent,
        CompanyEditComponent,
        RespondentComponent,
        DepartmentComponent,
        FocusableDirective
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
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatTreeModule,
        MatSnackBarModule,
        StoreModule.forRoot({ auth: authReducer, company: dataReducer }, {}),
        EffectsModule.forRoot(authEffects, dataEffects),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
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

