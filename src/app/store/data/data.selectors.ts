import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState } from './data.reducer';
import { getAuthorizedUser } from '../auth/auth.selectors';
import { IRespondent } from '@models/respondent.model';
import { TLoginResult } from 'src/app/services/auth.service';
import { TObjectId, TWithId } from '@models/common.model';
import { IDepartment } from '@models/department.model';

const featureKey = 'company';
interface FeatureState extends IState { }

// selectFeature will have the type MemoizedSelector<object, FeatureState>
const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const getDataLoadError = createSelector(
    selectFeature,
    (state: IState) => state.error
)

export const getTeam = createSelector(
    selectFeature,
    (state: IState) => state.data?.team
)

export const getDepartments = createSelector(
    selectFeature,
    (state: IState) => state.data?.departments
)

export const getRespondent = (_id: TObjectId<IRespondent>) => createSelector(
    selectFeature,
    (state: IState) => state.data?.team.filter(respondent => respondent._id === _id)
)

export const getTeamExceptAuthorizedUser = createSelector(
    getTeam,
    getDepartments,
    getAuthorizedUser,
    (team: TWithId<IRespondent>[] | undefined, departments: TWithId<IDepartment>[] | undefined, authorizedUser?: TLoginResult | null) =>
        team?.filter(respondent => respondent._id !== authorizedUser?.respondentId)
            .map(respondent => ({
                ...respondent,
                department: departments?.find(department => department._id === respondent.departmentId)?._id
            }))
            .map(respondent => ({
                ...respondent,
                fullName: [respondent.lastName, respondent.firstName].join(' ')
            }))
)

export const getDepartmentsAndTeam = createSelector(
    getDepartments,
    getTeam,
    (departments, team) => ({ departments, team })
)


export const getCompanyId = createSelector(
    selectFeature,
    (state: IState) => state.data?._id
)

export const getLoaded = createSelector(
    selectFeature,
    (state: IState) => state.loaded
)

export const getAuthorizedUserData = createSelector(
    getAuthorizedUser,
    getTeam,
    (user, team) => team?.find(teammate => teammate._id === user?.respondentId)
)