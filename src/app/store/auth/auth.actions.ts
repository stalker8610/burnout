import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { TLoginResult } from "src/app/services/auth.service";
import { TObjectId, IWithMessage } from "@models/common.model";
import { IRespondent } from "@models/respondent.model";
import { ISignupToken } from "@models/token.model";

export const AuthActions = createActionGroup({
    source: 'Auth API',
    events: {
        authStatusRequested: emptyProps(),
        getAuthStatus: emptyProps(),
        getAuthStatusSuccessful: props<{ user: TLoginResult | null }>(),
        getAuthStatusFailed: props<IWithMessage>(),
        
        login: props<{ email: string, password: string }>(),
        loginFailed: props<IWithMessage>(),
        loginSuccessful: emptyProps(),
        
        logout: emptyProps(),
        logoutFailed: props<IWithMessage>(),
        logoutSuccessful: emptyProps(),
        
        invite: props<{ respondentId: TObjectId<IRespondent> }>(),
        inviteFailed: props<IWithMessage>(),
        inviteSuccessful: props<IWithMessage>(),
        
        signup: props<{ token: TObjectId<ISignupToken>, password: string }>(),
        signupFailed: props<IWithMessage>(),
        signupSuccessful: props<IWithMessage>(),
        
        validateToken: props<{ token: TObjectId<ISignupToken> }>(),
        validateTokenFailed: props<IWithMessage>(),
        validateTokenSuccessful: emptyProps(),
    }
})