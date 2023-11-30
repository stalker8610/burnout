import { createAction, props } from "@ngrx/store";
import { TObjectId, IWithMessage } from '@models/common.model';
import { ICompany } from "@models/company.model";

const reportActionNames = (reportName: string) => ({
    ReportRequested: `[Report ${reportName} Page] Report Requested`,
    ReportLoad: `[Reports API] ${reportName} Data Load`,
    ReportLoadFailed: `[Reports API] ${reportName} Data Load Failed`,
    ReportLoadSuccessful: `[Reports API] ${reportName} Data Load Successful`,
})


export const reportActions = <TData, TQuery>(reportName: string) => {
    const actionNames = reportActionNames(reportName);
    return {
        reportRequested: createAction(
            actionNames.ReportRequested,
            //props<{ companyId: TObjectId<ICompany> }>()
            props<{ query: TQuery }>()
        ),
        reportLoad: createAction(
            actionNames.ReportLoad,
            props<{ query: TQuery }>()
            //props<{ companyId: TObjectId<ICompany> }>()

        ),
        reportLoadFailed: createAction(
            actionNames.ReportLoadFailed,
            props<IWithMessage>()
        ),
        reportLoadSuccessful: createAction(
            actionNames.ReportLoadSuccessful,
            props<{ data: TData }>()
        )
    }
}

export type TReportActions = ReturnType<typeof reportActions>