import { createSelector, createFeatureSelector, Store } from '@ngrx/store';
import { IState } from './auth.reducer';
import { map } from 'rxjs';
import { concatRespondentName } from '../data/data.util';

const featureKey = 'auth';
interface FeatureState extends IState { }
const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const requestDone = createSelector(
    selectFeature,
    (state: IState) => state.getMeRequestDone
)

export const getAuthorizedUser = createSelector(
    selectFeature,
    (state: IState) => state.authorizedUser
)

export const isUserAuthorized = (store: Store) =>
    store.select(getAuthorizedUser)
        .pipe(map(value => !!value))

export const getAuthorizedUserName = createSelector(
    getAuthorizedUser,
    (user) => user?.respondent && concatRespondentName(user.respondent) || ''
)

export const isSignupTokenValid = createSelector(
    selectFeature,
    (state: IState) => state.isTokenValid
)

export const isSignUpSuccessful = createSelector(
    selectFeature,
    (state: IState) => state.isSignUpSuccessful
)