
import { registerReport } from "./report-generator/report-generator.register"
import { TCompanyReportQuery } from "@models/reports/report-common.model"
import { IReportPassStatisticResponse } from "@models/reports/report-pass-statistic.model"

export const {
    actions,
    reducer,
    selectors,
    effects } =
    registerReport<IReportPassStatisticResponse, TCompanyReportQuery>(
        'Pass Statistic',
        'reportPassStatistic',
        (reportService, query) => reportService.getReportPassStatistic(query))