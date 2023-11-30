import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState } from './report-generator.reducer';

export const createSelectors = <T>(featureKey: string) => {

    interface FeatureState extends IState<T> { }
    const selectFeature = createFeatureSelector<FeatureState>(featureKey);

    return {

        getDataLoadError: createSelector(
            selectFeature,
            (state: IState<T>) => state.error
        ),

        getReportData: createSelector(
            selectFeature,
            (state: IState<T>) => state.data
        ),

        getLoaded: createSelector(
            selectFeature,
            (state: IState<T>) => state.loaded
        )
    }
}





