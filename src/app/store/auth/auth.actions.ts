import { IRespondent } from './../../../models/respondent.model';
import { TObjectId } from './../../../models/common.model';
import { createAction, props } from "@ngrx/store";
import { TLoginResult } from "src/app/services/auth.service";
import { IWithMessage } from "@models/common.model";
import { ISignupToken } from '@models/token.model';

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
    Invite = '[Company Page] Invite Respondent',
    InviteFailed = '[Auth API] Invite Respondent Failed',
    InviteSuccessful = '[Auth API] Invite Respondent Successful',
    Signup = '[Signup Page] Signup',
    SignupFailed = '[Auth API] Signup Failed',
    SignupSuccessful = '[Auth API] Signup Successful',
    ValidateToken = '[Signup Page] ValidateToken',
    ValidateTokenFailed = '[Auth API] ValidateToken Failed',
    ValidateTokenSuccessful = '[Auth API] ValidateToken Successful',
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
    props<IWithMessage>()
)

export const authStatusRequested = createAction(
    EAuthActions.AuthStatusRequested
)

export const login = createAction(
    EAuthActions.Login,
    props<{ email: string, password: string }>()
)

export const loginFailed = createAction(
    EAuthActions.LoginFailed,
    props<IWithMessage>())

export const loginSuccessful = createAction(
    EAuthActions.LoginSuccessful
);

export const logout = createAction(
    EAuthActions.Logout
);

export const logoutFailed = createAction(
    EAuthActions.LogoutFailed,
    props<IWithMessage>()
)

export const logoutSuccessful = createAction(
    EAuthActions.LogoutSuccessful
);



export const invite = createAction(
    EAuthActions.Invite,
    props<{ respondentId: TObjectId<IRespondent> }>()
);

export const inviteFailed = createAction(
    EAuthActions.InviteFailed,
    props<IWithMessage>()
)

export const inviteSuccessful = createAction(
    EAuthActions.InviteSuccessful,
    props<IWithMessage>()
);


export const signup = createAction(
    EAuthActions.Signup,
    props<{ token: TObjectId<ISignupToken>, password: string }>()
);

export const signupFailed = createAction(
    EAuthActions.SignupFailed,
    props<IWithMessage>()
)

export const signupSuccessful = createAction(
    EAuthActions.SignupSuccessful,
    props<IWithMessage>()
);


export const validateToken = createAction(
    EAuthActions.ValidateToken,
    props<{ token: TObjectId<ISignupToken> }>()
);

export const validateTokenFailed = createAction(
    EAuthActions.ValidateTokenFailed,
    props<IWithMessage>()
)

export const validateTokenSuccessful = createAction(
    EAuthActions.ValidateTokenSuccessful
);