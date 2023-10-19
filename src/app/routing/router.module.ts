import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';

import { LoginComponent } from '../auth/login/login.component';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { SurveyComponent } from '../survey/survey.component';


const routes: Routes = [
    { path: 'signup/:token', component: SignupComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'survey/:surveyId', component: SurveyComponent, pathMatch: 'full', /* canActivate: [authGuard] */ },
    { path: '**', component: NotFoundComponent }
];

// configures NgModule imports and exports
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        provideRouter(routes, withComponentInputBinding())]
})
export class AppRoutingModule { }