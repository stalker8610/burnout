import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState } from './data.reducer';
import { getAuthorizedUser } from '../auth/auth.selectors';
import { IRespondent, SignUpStatus } from '@models/respondent.model';
import { TLoginResult } from 'src/app/services/auth.service';
import { TObjectId, TWithId } from '@models/common.model';
import { IDepartment } from '@models/department.model';
import { concatRespondentName } from './data.util';

const featureKey = 'company';
interface FeatureState extends IState { }
const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const getDataLoadError = createSelector(
    selectFeature,
    (state: IState) => state.error
)

export const getTeam = (withDisabled: boolean) => createSelector(
    selectFeature,
    (state: IState) => {
        return (withDisabled
            ? state.data?.team
            : state.data?.team.filter(teammate => teammate.signUpStatus !== SignUpStatus.Disabled)) || [];
    }
)

export const getDepartments = createSelector(
    selectFeature,
    (state: IState) => state.data?.departments || []
)

export const getRespondent = (_id: TObjectId<IRespondent>) => createSelector(
    selectFeature,
    (state: IState) => state.data?.team.find(respondent => respondent._id === _id) || null
)


export const getRespondentsOfDepartment = (_id: TObjectId<IDepartment>, withDisabled: boolean) => createSelector(
    getTeam(withDisabled),
    team => team?.filter(respondent => respondent.departmentId === _id) || []
)

export const hasDepartmentRespondents = (_id: TObjectId<IDepartment>, withDisabled: boolean) => createSelector(
    getRespondentsOfDepartment(_id, withDisabled),
    respondents => !!respondents.length
)

export const getDepartment = (_id: TObjectId<IDepartment>) => createSelector(
    selectFeature,
    (state: IState) => state.data?.departments.find(department => department._id === _id) || null
)

export const getTeamExceptAuthorizedUser = createSelector(
    getTeam(false),
    getDepartments,
    getAuthorizedUser,
    (team: TWithId<IRespondent>[] | undefined, departments: TWithId<IDepartment>[] | undefined, authorizedUser?: TLoginResult | null) =>
        team?.filter(respondent => respondent._id !== authorizedUser?.respondentId)
            .map(respondent => ({
                ...respondent,
                department: departments?.find(department => department._id === respondent.departmentId),
                fullName: concatRespondentName(respondent)
            })) ?? null
)

export const getTeammateForFeedback = (respondentId: TObjectId<IRespondent>) => createSelector(
    getTeamExceptAuthorizedUser,
    (team) => team?.find(respondent => respondent._id === respondentId) || null
)

export const getDepartmentsAndTeam = createSelector(
    getDepartments,
    getTeam(true),
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