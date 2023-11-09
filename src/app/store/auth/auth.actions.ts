import { createAction, props } from "@ngrx/store";
import { TLoginResult } from "src/app/services/auth.service";

enum EAuthActions {
    AppStarted = '[App] App Started',
    AuthStatusRequested = '[App] Auth Status Requested',
    GetAuthStatus = '[App] Get Auth Status',
    GetAuthStatusSuccessful = '[Auth API] Get Auth Status Successful',
    GetAuthStatusFailed = '[Auth API] Get Auth Status Failed',
    Login = '[Login Page] Login',
    LoginFailed = '[Auth API] Login Failed',
    LoginSuccessful = '[Auth API] Login Successful',
    Logout = '[Logout Page] Logout',
    LogoutFailed = '[Auth API] Logout Failed',
    LogoutSuccessful = '[Auth API] Logout Successful',
}

export const appStarted = createAction(
    EAuthActions.AppStarted
)

export const getAuthStatus = createAction(
    EAuthActions.GetAuthStatus
)

export const getAuthStatusSuccessful = createAction(
    EAuthActions.GetAuthStatusSuccessful,
    props<{ user: TLoginResult | null }>()
)

export const getAuthStatusFailed = createAction(
    EAuthActions.GetAuthStatusFailed,
    props<{ error: string }>()
)

export const authStatusRequested = createAction(
    EAuthActions.AuthStatusRequested
)

export const login = createAction(
    EAuthActions.Login,
    props<{ email: string, password: string }>())

export const loginFailed = createAction(
    EAuthActions.LoginFailed,
    props<{ error: string }>())

export const loginSuccessful = createAction(
    EAuthActions.LoginSuccessful,
    props<TLoginResult & { navigate: boolean }>());

export const logout = createAction(
    EAuthActions.Logout);

export const logoutFailed = createAction(
    EAuthActions.LogoutFailed,
    props<{ error: string }>())

export const logoutSuccessful = createAction(
    EAuthActions.LogoutSuccessful,
    props<{ navigate: boolean }>()
);