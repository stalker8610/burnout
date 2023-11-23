import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState } from './report-pass-statistic.reducer';

const featureKey = 'reportPassStatistic';
interface FeatureState extends IState { }
const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const getDataLoadError = createSelector(
    selectFeature,
    (state: IState) => state.error
)

export const getReportData = createSelector(
    selectFeature,
    (state: IState) => state.data
)

export const getLoaded = createSelector(
    selectFeature,
    (state: IState) => state.loaded
)