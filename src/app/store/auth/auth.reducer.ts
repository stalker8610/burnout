
import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { TLoginResult } from '../../services/auth.service';
import { TObjectId } from "@models/common.model";
import { ISignupToken } from "@models/token.model";

export interface IState {
    getMeRequestDone: boolean,
    authorizedUser: TLoginResult | null,
    signupToken: TObjectId<ISignupToken> | null,
    isTokenValid: boolean | null,
    isSignUpSuccessful: boolean | null,
    error: string | null
}

const initialState: IState = {
    getMeRequestDone: false,
    authorizedUser: null,
    signupToken: null,
    isTokenValid: null,
    isSignUpSuccessful: null,
    error: null
}

export const authReducer = createReducer(
    initialState,
    on(AuthActions.getAuthStatusSuccessful, state => ({
        ...state,
        getMeRequestDone: true
    })),
    on(AuthActions.loginFailed, (state, { message }) => ({
        ...state,
        error: message,
    })),
    on(AuthActions.loginSuccessful, (state) => ({
        ...state,
        getMeRequestDone: false
    })),
    on(AuthActions.getAuthStatusSuccessful, (state, { user }) => ({
        ...state,
        getMeRequestDone: true,
        authorizedUser: user
    })),
    on(AuthActions.logoutSuccessful, () => ({
        ...initialState
    })),
    on(AuthActions.logoutFailed, (state, { message }) => ({
        ...state,
        error: message,
    })),
    on(AuthActions.inviteFailed, (state, { message }) => ({
        ...state,
        error: message,
    })),
    
    on(AuthActions.validateToken, (state, { token }) => ({
        ...state,
        signupToken: token,
        isTokenValid: null,
        error: null,
    })),
    on(AuthActions.validateTokenSuccessful, (state) => ({
        ...state,
        isTokenValid: true,
    })),
    on(AuthActions.validateTokenFailed, (state, { message }) => ({
        ...state,
        isTokenValid: false,
        error: message
    })),

    
    on(AuthActions.signup, (state, props) => ({
        ...state,
        isSignUpSuccessful: null,
        error: null,
    })),
    
    on(AuthActions.signupSuccessful, (state, { message }) => ({
        ...state,
        isSignUpSuccessful: true,
        error: null,
    })),

    on(AuthActions.signupFailed, (state, { message }) => ({
        ...state,
        isSignUpSuccessful: false,
        error: message,
    })),
    
)        
