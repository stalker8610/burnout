import { createReducer, on } from "@ngrx/store";
import * as Actions from "./survey.actions";
import { TWithId } from "@models/common.model";
import { ISurvey, EOperationStatus } from "@models/survey.model";


export interface IState {
    survey: TWithId<ISurvey> | null,
    loaded: boolean,
    error: string | null,
    operationStatus: EOperationStatus | null,
    currentQuestionIndex: number
}

const initialState: IState = {
    survey: null,
    loaded: false,
    error: null,
    operationStatus: null,
    currentQuestionIndex: -1
}

export const surveyReducer = createReducer(
    initialState,
    on(Actions.load, state => ({
        ...state,
        loaded: false,
        error: null,
    })),
    on(Actions.loadFailed, (state, { message }) => ({
        ...state,
        error: message,
    })),
    on(Actions.loadSuccessful, (state, { survey }) => ({
        ...state,
        loaded: true,
        survey,
        currentQuestionIndex: survey?.progress || 0
    })),
    on(Actions.nextQuestionRequestCompleted, state => ({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        operationStatus: EOperationStatus.Wait
    })),
    on(Actions.answerConfirmed, state => ({
        ...state,
        operationStatus: EOperationStatus.Pending,
        error: null
    })),
    on(Actions.questionSkipped, state => ({
        ...state,
        operationStatus: EOperationStatus.Pending,
        error: null
    })),
    on(Actions.operationCompletedSuccessful, state => ({
        ...state,
        operationStatus: EOperationStatus.Complete
    })),
    on(Actions.operationFailed, (state, { message }) => ({
        ...state,
        operationStatus: EOperationStatus.Failed,
        error: message
    })),
    on(Actions.surveyCompleteSuccessful, (state, { survey }) => ({
        ...state,
        survey
    }))
)        
