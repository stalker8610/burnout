import { createReducer, on } from "@ngrx/store";
import { reportActions } from "./report-generator.actions";

export interface IState<T> {
    loaded: boolean,
    data: T | null,
    error: string | null
}

export const reportReducer = <T, K>(reportName: string) => {

    const initialState: IState<T> = {
        loaded: false,
        data: null,
        error: null
    }

    const Actions = reportActions<T, K>(reportName);

    return createReducer(
        initialState,
        on(Actions.reportLoad, state => ({
            ...state,
            loaded: false,
            error: null,
        })),
        on(Actions.reportLoadFailed, (state, { message }) => ({
            ...state,
            error: message,
        })),
        on(Actions.reportLoadSuccessful, (state, { data }) => ({
            ...state,
            loaded: true,
            data
        }))
    )
    
}        
