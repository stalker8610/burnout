import { TObjectId } from '../common.model.js';
import { IDepartment } from '../department.model.js';

export interface IReportPassStaticticRecord {
    period: string, // Date
    departmentId: TObjectId<IDepartment>,
    generated: number,
    taken: number,
    givenAnswers: number
}

export interface IReportPassStatisticResponse {
    periods: string[], // Dates
    records: IReportPassStaticticRecord[]
}