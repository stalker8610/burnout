import { createReducer, on } from "@ngrx/store";
import * as DataActions from "./data.actions";
import { TCompanyStructure } from "src/app/services/data.service";
import { TObjectId, TWithId } from "@models/common.model";
import { IDepartment } from "@models/department.model";

export interface IState {
    data: TCompanyStructure | null,
    createdDepartmentId: TObjectId<IDepartment> | null,
    error: string | null
}

const initialState: IState = {
    data: null,
    createdDepartmentId: null,
    error: null
}

export const dataReducer = createReducer(
    initialState,
    on(DataActions.load, state => ({
        ...state,
        error: null,
    })),
    on(DataActions.loadFailed, (state, { error }) => ({
        ...state,
        error,
    })),
    on(DataActions.loadSuccessful, (state, data: TCompanyStructure) => ({
        ...state,
        data
    })),
    on(DataActions.releaseData, state => ({
        ...state,
        error: null,
        data: null
    })),
    on(DataActions.addDepartmentSuccessful, (state, department: TWithId<IDepartment>) => ({
        ...state,
        ['data.departments']: [...state.data!.departments, department],
        createdDepartmentId: department._id
    }))
)        
