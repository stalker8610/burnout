
import { registerReport } from "./report-generator/report-generator.register"
import { TCompanyReportQuery } from "@models/reports/report-common.model"
import { IReportCompanyScoresResponse } from "@models/reports/report-company-scores.model"

export const {
    actions,
    reducer,
    selectors,
    effects } =
    registerReport<IReportCompanyScoresResponse, TCompanyReportQuery>(
        'Company Scores',
        'reportCompanyScores',
        (reportService, query) => reportService.getReportCompanyScores(query))