
import { registerReport } from "./report-generator/report-generator.register"
import { TCompanyReportQuery } from "@models/reports/report-common.model"
import { IReportWallResponse } from "@models/reports/report-wall.model"

export const {
    actions,
    reducer,
    selectors,
    effects } =
    registerReport<IReportWallResponse, TCompanyReportQuery>(
        'Wall',
        'reportWall',
        (reportService, query) => reportService.getReportWall(query))