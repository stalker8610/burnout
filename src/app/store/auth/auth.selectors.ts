import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState } from './auth.reducer';

const featureKey = 'auth';
interface FeatureState extends IState { }

// selectFeature will have the type MemoizedSelector<object, FeatureState>
const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const getLoginError = createSelector(
    selectFeature,
    (state: IState) => state.error
)

export const getLogoutError = createSelector(
    selectFeature,
    (state: IState) => state.error
)

export const requestDone = createSelector(
    selectFeature,
    (state: IState) => state.done
)

export const getAuthorizedUser = createSelector(
    selectFeature,
    (state: IState) => state.authorizedUser
)