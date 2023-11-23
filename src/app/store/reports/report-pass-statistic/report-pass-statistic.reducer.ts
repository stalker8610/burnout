import { createReducer, on } from "@ngrx/store";
import * as Actions from "./report-pass-statistic.actions";
import { IReportPassStatisticResponse } from "@models/reports/report-pass-statistic.model";

export interface IState {
    loaded: boolean,
    data: IReportPassStatisticResponse | null,
    error: string | null
}

const initialState: IState = {
    loaded: false,
    data: null,
    error: null
}

export const reportPassStatisticReducer = createReducer(
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
