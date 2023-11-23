import { createReducer, on } from "@ngrx/store";
import * as Actions from "./report-wall.actions";
import { IReportWallRecord } from "@models/reports/report-wall.model";

export interface IState {
    loaded: boolean,
    data: IReportWallRecord[] | null,
    error: string | null
}

const initialState: IState = {
    loaded: false,
    data: null,
    error: null
}

export const reportWallReducer = createReducer(
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
