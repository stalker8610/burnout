import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { UsersComponent } from '../users/users.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { SignupComponent } from '../signup/signup.component';


const routes: Routes = [
    { path: 'signup', component: SignupComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'users', component: UsersComponent, pathMatch: 'full', /* canActivate: [authGuard] */ },
    /* { path: '', redirectTo: 'home', pathMatch: 'full' }, */
    { path: '**', component: NotFoundComponent }
];

// configures NgModule imports and exports
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }