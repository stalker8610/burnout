import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { TWithId, TObjectId, IWithMessage } from '@models/common.model';
import { IRespondent } from "@models/respondent.model";
import { ISurvey, TQuestionConfirmedAnswer, TQuestionSkipped } from '@models/survey.model';

export const SurveyActions = createActionGroup({
    source: 'Survey API',
    events: {
        loadRequested: props<{ respondentId: TObjectId<IRespondent> } | { surveyId: TObjectId<ISurvey> }>(),
        load: props<{ respondentId: TObjectId<IRespondent> } | { surveyId: TObjectId<ISurvey> }>(),
        loadFailed: props<IWithMessage>(),
        loadSuccessful: props<{ survey: TWithId<ISurvey> | null }>(),

        nextQuestionRequested: emptyProps(),
        nextQuestionRequestCompleted: emptyProps(),

        answerConfirmed: props<{ surveyId: TObjectId<ISurvey>, answer: TQuestionConfirmedAnswer }>(),
        questionSkipped: props<{ surveyId: TObjectId<ISurvey>, skipped: TQuestionSkipped }>(),
        operationCompletedSuccessful: emptyProps(),
        operationFailed: props<IWithMessage>(),

        surveyCompleted: props<{ surveyId: TObjectId<ISurvey> }>(),
        surveyCompleteSuccessful: props<{ survey: TWithId<ISurvey> }>(),
        surveyCompleteFailed: props<IWithMessage>()
    }
})