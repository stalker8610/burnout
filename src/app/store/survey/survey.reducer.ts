import { createReducer, on } from "@ngrx/store";
import { SurveyActions } from "./survey.actions";
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
    on(SurveyActions.load, state => ({
        ...state,
        loaded: false,
        error: null,
    })),
    on(SurveyActions.loadFailed, (state, { message }) => ({
        ...state,
        error: message,
    })),
    on(SurveyActions.loadSuccessful, (state, { survey }) => ({
        ...state,
        loaded: true,
        survey,
        currentQuestionIndex: survey?.progress || 0
    })),
    on(SurveyActions.nextQuestionRequestCompleted, state => ({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        operationStatus: EOperationStatus.Wait
    })),
    on(SurveyActions.answerConfirmed, state => ({
        ...state,
        operationStatus: EOperationStatus.Pending,
        error: null
    })),
    on(SurveyActions.questionSkipped, state => ({
        ...state,
        operationStatus: EOperationStatus.Pending,
        error: null
    })),
    on(SurveyActions.operationCompletedSuccessful, state => ({
        ...state,
        operationStatus: EOperationStatus.Complete
    })),
    on(SurveyActions.operationFailed, (state, { message }) => ({
        ...state,
        operationStatus: EOperationStatus.Failed,
        error: message
    })),
    on(SurveyActions.surveyCompleteSuccessful, (state, { survey }) => ({
        ...state,
        survey
    }))
)        
