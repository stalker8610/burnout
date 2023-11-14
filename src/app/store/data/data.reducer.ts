import { createReducer, on } from "@ngrx/store";
import * as DataActions from "./data.actions";
import { TCompanyStructure } from "src/app/services/data.service";
import { TObjectId, TWithId } from "@models/common.model";
import { IDepartment } from "@models/department.model";
import { IRespondent } from "@models/respondent.model";

export interface IState {
    data: TCompanyStructure | null,
    loaded: boolean,
    error: string | null
}

const initialState: IState = {
    data: null,
    loaded: false,
    error: null
}

export const dataReducer = createReducer(
    initialState,
    on(DataActions.load, state => ({
        ...state,
        loaded: false,
        error: null,
    })),
    on(DataActions.loadFailed, (state, { message }) => ({
        ...state,
        error: message,
    })),
    on(DataActions.loadSuccessful, (state, payload: { data: TCompanyStructure }) => ({
        ...state,
        loaded: true,
        data: payload.data
    })),
    on(DataActions.releaseData, state => ({
        ...state,
        error: null,
        loaded: false,
        data: null
    })),

    on(DataActions.addDepartmentSuccessful, (state, payload: { department: TWithId<IDepartment> }) => ({
        ...state,
        data: {
            ...state.data!,
            departments: [...state.data!.departments, payload.department]
        }
    })),
    on(DataActions.addDepartmentFailed, (state, payload) => ({
        ...state,
        error: payload.message
    })),

    on(DataActions.addRespondentSuccessful, (state, payload: { respondent: TWithId<IRespondent> }) => ({
        ...state,
        data: {
            ...state.data!,
            team: [...state.data!.team, payload.respondent]
        }
    })),
    on(DataActions.addRespondentFailed, (state, payload) => ({
        ...state,
        error: payload.message
    })),

    on(DataActions.removeRespondentSuccessful, (state, payload) => ({
        ...state,
        data: {
            ...state.data!,
            team: state.data!.team.filter(teammate => teammate._id !== payload.respondentId)
        }
    })),
    on(DataActions.removeRespondentFailed, (state, payload) => ({
        ...state,
        error: payload.message
    })),

    on(DataActions.removeDepartmentSuccessful, (state, payload) => ({
        ...state,
        data: {
            ...state.data!,
            departments: state.data!.departments.filter(department => department._id !== payload.departmentId)
        }
    })),
    on(DataActions.removeDepartmentFailed, (state, payload) => ({
        ...state,
        error: payload.message
    })),



    on(DataActions.patchRespondentSuccessful, (state, payload) => ({
        ...state,
        data: {
            ...state.data!,
            team: [
                ...state.data!.team.filter(teammate => teammate._id !== payload.respondent._id),
                payload.respondent
            ]
        }
    })),
    on(DataActions.patchRespondentFailed, (state, payload) => ({
        ...state,
        error: payload.message
    })),



    on(DataActions.patchDepartmentSuccessful, (state, payload) => ({
        ...state,
        data: {
            ...state.data!,
            departments: [
                ...state.data!.departments.filter(department => department._id !== payload.department._id),
                payload.department
            ]
        }
    })),
    on(DataActions.patchDepartmentFailed, (state, payload) => ({
        ...state,
        error: payload.message
    })),

)        
