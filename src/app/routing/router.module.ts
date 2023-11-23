import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';

import { LoginComponent } from '../auth/login/login.component';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { SurveyComponent } from '../survey/survey.component';
import { ReportWallComponent } from '../reports/report-wall/report-wall.component';
import { CompanyComponent } from '../company/company.component';
import { LogoutComponent } from '../auth/logout/logout.component';
import { ReportMyComponent } from '../reports/report-my/report-my.component';
import { ReportCompanyComponent } from '../reports/report-company/report-company.component';

import { isAuthorizedGuard, isHRUserGuard, isNotAuthorizedGuard, redirectHomeGuard } from './guards.service';
import { RespondentComponent } from '../company/respondent/respondent.component';


const routes: Routes = [
    { path: 'signup/:token', canActivate: [isNotAuthorizedGuard], component: SignupComponent, pathMatch: 'full' },
    { path: 'login', canActivate: [isNotAuthorizedGuard], component: LoginComponent, pathMatch: 'full' },
    { path: 'logout', canActivate: [isAuthorizedGuard], component: LogoutComponent, pathMatch: 'full' },
    { path: 'survey/:surveyId', canActivate: [isAuthorizedGuard], component: SurveyComponent, pathMatch: 'full' },

    {
        path: 'home', component: HomeComponent, canActivate: [isAuthorizedGuard],
        children: [
            {
                path: '',
                canActivate: [redirectHomeGuard],
                component: NotFoundComponent,
                pathMatch: 'full'
            },
            {
                path: 'wall',
                canActivate: [isHRUserGuard],
                component: ReportWallComponent,
                pathMatch: 'full'
            },
            {
                path: 'my',
                component: ReportMyComponent,
                pathMatch: 'full'
            },
            {
                path: 'my-survey',
                canActivate: [isAuthorizedGuard],
                component: SurveyComponent,
                pathMatch: 'full'
            },
            {
                path: 'reports',
                canActivate: [isHRUserGuard],
                component: ReportCompanyComponent,
                pathMatch: 'full'
            },
            {
                path: 'company',
                canActivate: [isHRUserGuard],
                component: CompanyComponent,
                pathMatch: 'full'
            },
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];

// configures NgModule imports and exports
@NgModule({
    imports: [RouterModule.forRoot(routes/* , { enableTracing: true } */)],
    exports: [RouterModule],
    providers: [
        provideRouter(routes, withComponentInputBinding())]
})
export class AppRoutingModule { }