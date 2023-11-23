import { createAction, props } from "@ngrx/store";
import { TObjectId, IWithMessage } from '@models/common.model';
import { ICompany } from "@models/company.model";
import { IReportWallRecord } from "@models/reports/report-wall.model";

enum EReportsActions {
    ReportRequested = '[Report Wall Page] Report Requested',
    ReportLoad = '[Report API] Wall Report Load',
    ReportLoadFailed = '[Report API] Wall Report Load Failed',
    ReportLoadSuccessful = '[Report API] Wall Report Load Successful',
}

export const reportRequested = createAction(
    EReportsActions.ReportRequested,
    props<{ companyId: TObjectId<ICompany> }>()
)

export const reportLoad = createAction(
    EReportsActions.ReportLoad,
    props<{ companyId: TObjectId<ICompany> }>()
)

export const reportLoadFailed = createAction(
    EReportsActions.ReportLoadFailed,
    props<IWithMessage>()
)

export const reportLoadSuccessful = createAction(
    EReportsActions.ReportLoadSuccessful,
    props<{ data: IReportWallRecord[] }>()
)