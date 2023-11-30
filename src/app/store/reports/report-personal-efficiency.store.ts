
import { registerReport } from "./report-generator/report-generator.register"
import { TPersonalReportQuery } from "@models/reports/report-common.model"
import { IReportPersonalEfficiencyResponse } from "@models/reports/report-personal-efficiency.model"

export const {
    actions,
    reducer,
    selectors,
    effects } =
    registerReport<IReportPersonalEfficiencyResponse, TPersonalReportQuery>(
        'Personal Efficiency',
        'reportPersonalEfficiency',
        (reportService, query) => reportService.getReportPersonalEfficiency(query))