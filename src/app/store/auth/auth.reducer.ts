
import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { TLoginResult } from '../../services/auth.service';

export interface IState {
    done: boolean,
    authorizedUser: TLoginResult | null,
    error: string | null
}

const initialState: IState = {
    done: false,
    authorizedUser: null,
    error: null
}

export const authReducer = createReducer(
    initialState,
    on(AuthActions.getAuthStatusSuccessful, state => ({
        ...state,
        done: true
    })),
    on(AuthActions.loginFailed, (state, { error }) => ({
        ...state,
        error,
    })),
    on(AuthActions.loginSuccessful, (state, authorizedUser) => ({
        ...state,
        done: true,
        authorizedUser
    })),
    on(AuthActions.logoutSuccessful, () => ({
        ...initialState,
        done: true,
    })),
    on(AuthActions.logoutFailed, (state, { error }) => ({
        ...state,
        error,
    }))
)        
