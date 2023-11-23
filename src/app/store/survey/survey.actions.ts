import { createAction, props } from "@ngrx/store";
import { TWithId, TObjectId, IWithMessage } from '@models/common.model';
import { IRespondent } from "@models/respondent.model";
import { ISurvey, TQuestionConfirmedAnswer, TQuestionSkipped } from '@models/survey.model';

enum ESurveyActions {
    LoadSurveyDataRequested = '[Survey Page] Load Survey Data Requested',
    LoadData = '[Survey API] Load Survey',
    LoadDataFailed = '[Survey API] Load Survey Data Failed',
    LoadDataSuccessful = '[Survey API] Load Survey Data Successful',

    NextQuestionRequested = '[Survey Page] Next Question Requested',
    NextQuestionRequestCompleted = '[Survey API] Next Question Request Completed',
    AnswerConfirmed = '[Survey Page] Answer Confirmed',
    QuestionSkipped = '[Survey Page] Question Skipped',
    OperationCompletedSuccessful = '[Survey API] Operation Complete Successful',
    OpeartionFailed = '[Survey API] Operation Failed',

    SurveyCompleted = '[Survey API] Survey Completed',
    SurveyCompleteSuccessful = '[Survey API] Survey Completed Successful',
    SurveyCompleteFailed = '[Survey API] Survey Completed Failed',

}

export const loadRequested = createAction(
    ESurveyActions.LoadSurveyDataRequested,
    props<{ respondentId: TObjectId<IRespondent> } | { surveyId: TObjectId<ISurvey> }>()
)

export const load = createAction(
    ESurveyActions.LoadData,
    props<{ respondentId: TObjectId<IRespondent> } | { surveyId: TObjectId<ISurvey> }>()
)

export const loadFailed = createAction(
    ESurveyActions.LoadDataFailed,
    props<IWithMessage>()
)

export const loadSuccessful = createAction(
    ESurveyActions.LoadDataSuccessful,
    props<{ survey: TWithId<ISurvey> | null }>()
)

export const nextQuestionRequested = createAction(
    ESurveyActions.NextQuestionRequested
)

export const nextQuestionRequestCompleted = createAction(
    ESurveyActions.NextQuestionRequestCompleted
)

export const answerConfirmed = createAction(
    ESurveyActions.AnswerConfirmed,
    props<{ surveyId: TObjectId<ISurvey>, answer: TQuestionConfirmedAnswer }>()
)

export const questionSkipped = createAction(
    ESurveyActions.QuestionSkipped,
    props<{ surveyId: TObjectId<ISurvey>, skipped: TQuestionSkipped }>()
)

export const operationCompletedSuccessful = createAction(
    ESurveyActions.OperationCompletedSuccessful
)

export const operationFailed = createAction(
    ESurveyActions.OpeartionFailed,
    props<IWithMessage>()
)

export const surveyCompleted = createAction(
    ESurveyActions.SurveyCompleted,
    props<{ surveyId: TObjectId<ISurvey> }>()
)

export const surveyCompleteSuccessful = createAction(
    ESurveyActions.SurveyCompleteSuccessful,
    props<{ survey: TWithId<ISurvey> }>()
)

export const surveyCompleteFailed = createAction(
    ESurveyActions.SurveyCompleteFailed,
    props<IWithMessage>()
)