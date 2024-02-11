import { NgModule, isDevMode } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ru } from 'date-fns/locale';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './routing/router.module';

import { AppComponent } from './app.component';
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

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { authReducer } from './store/auth/auth.reducer';
import { dataReducer } from './store/data/data.reducer';
import { surveyReducer } from './store/survey/survey.reducer';
import * as authEffects from './store/auth/auth.effects';
import * as dataEffects from './store/data/data.effects';
import * as surveyEffects from './store/survey/survey.effects';
import * as messagableEffects from './store/messagable.effects';

import {
    reducer as reportWallReducer,
    effects as reportWallEffects
} from './store/reports/report-wall.store';

import {
    reducer as reportPersonalEfficiencyReducer,
    effects as reportPersonalEfficiencyEffects
} from './store/reports/report-personal-efficiency.store';

import {
    reducer as reportPersonalSkillsReducer,
    effects as reportPersonalSkillsEffects
} from './store/reports/report-personal-skills.store';

import {
    reducer as reportCompanyScoresReducer,
    effects as reportCompanyScoresEffects
} from './store/reports/report-company-scores.store';

import {
    reducer as reportPassStatisticReducer,
    effects as reportPassStatisticEffects
} from './store/reports/report-pass-statistic.store';





import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { RespondentComponent } from './company/respondent/respondent.component';
import { DepartmentComponent } from './company/department/department.component';
import { FocusableDirective } from './focusable.directive';

import { ReportCompanyComponent } from './reports/report-company/report-company.component';
import { ReportPassStatisticComponent } from './reports/report-company/report-pass-statistic/report-pass-statistic.component';
import { ReportCompanyScoresComponent } from './reports/report-company/report-company-scores/report-company-scores.component';

import { ReportPersonalComponent } from './reports/report-personal/report-personal.component';
import { ReportPersonalEfficiencyComponent } from './reports/report-personal/report-personal-efficiency/report-personal-efficiency.component';
import { ReportPersonalSkillsComponent } from './reports/report-personal/report-personal-skills/report-personal-skills.component';
import { LoginStatusContainerComponent } from './auth/login-status/login-status-container.component';


@NgModule({
    declarations: [
        AppComponent,
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
        CompanyEditComponent,
        RespondentComponent,
        DepartmentComponent,
        FocusableDirective,
        ReportPersonalEfficiencyComponent,
        ReportCompanyComponent,
        ReportPassStatisticComponent,
        ReportCompanyScoresComponent,
        ReportPersonalComponent,
        ReportPersonalSkillsComponent
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
        MatMenuModule,
        MatDatepickerModule,
        MatDateFnsModule,
        MatSelectModule,
        MatDialogModule,
        MatToolbarModule,
        StoreModule.forRoot({
            auth: authReducer,
            company: dataReducer,
            survey: surveyReducer,
            reportWall: reportWallReducer,
            reportPassStatistic: reportPassStatisticReducer,
            reportCompanyScores: reportCompanyScoresReducer,
            reportPersonalEfficiency: reportPersonalEfficiencyReducer,
            reportPersonalSkills: reportPersonalSkillsReducer
        }, {}),
        EffectsModule.forRoot(
            authEffects,
            dataEffects,
            surveyEffects,
            reportWallEffects,
            reportPassStatisticEffects,
            reportCompanyScoresEffects,
            reportPersonalEfficiencyEffects,
            reportPersonalSkillsEffects,
            messagableEffects),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        NgChartsModule,
        LoginStatusContainerComponent,
        LogoutComponent,
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
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: ru,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

