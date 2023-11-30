
import { registerReport } from "./report-generator/report-generator.register"
import { TPersonalReportQuery } from "@models/reports/report-common.model"
import { IReportPersonalSkillsResponse } from "@models/reports/report-personal-skills.model"

export const {
    actions,
    reducer,
    selectors,
    effects } =
    registerReport<IReportPersonalSkillsResponse, TPersonalReportQuery>(
        'Personal Skills',
        'reportPersonalSkills',
        (reportService, query) => reportService.getReportPersonalSkills(query))