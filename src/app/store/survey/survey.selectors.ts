import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState } from './survey.reducer';

const featureKey = 'survey';
interface FeatureState extends IState { }
const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const getDataLoadError = createSelector(
    selectFeature,
    (state: IState) => state.error
)

export const getSurvey = createSelector(
    selectFeature,
    (state: IState) => state.survey
)

export const getLoaded = createSelector(
    selectFeature,
    (state: IState) => state.loaded
)

export const getCurrentQuestionIndex = createSelector(
    selectFeature,
    (state: IState) => state.currentQuestionIndex
)

export const getCurrentQuestion = createSelector(
    selectFeature,
    getCurrentQuestionIndex,
    getSurvey,
    (state, questionIndex, survey) => survey?.questions[questionIndex] || null
)

export const getOperationStatus = createSelector(
    selectFeature,
    (state: IState) => state.operationStatus
)