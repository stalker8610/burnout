import { createAction, props } from "@ngrx/store";
import { TObjectId, IWithMessage } from '@models/common.model';
import { ICompany } from "@models/company.model";
import { IReportPassStatisticResponse } from "@models/reports/report-pass-statistic.model";

enum EReportsActions {
    ReportRequested = '[Report Pass Statistic Page] Report Requested',
    ReportLoad = '[Report API] Pass Statistic Report Load',
    ReportLoadFailed = '[Report API] Pass Pass Statistic Report Load Failed',
    ReportLoadSuccessful = '[Report API] Pass Statistic Report Load Successful',
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
    props<{ data: IReportPassStatisticResponse }>()
)