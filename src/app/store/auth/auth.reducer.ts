
import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { TLoginResult } from '../../services/auth.service';

export interface IState {
    getMeRequestDone: boolean,
    authorizedUser: TLoginResult | null,
    error: string | null
}

const initialState: IState = {
    getMeRequestDone: false,
    authorizedUser: null,
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
    }))
)        
