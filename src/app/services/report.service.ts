

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReportWallResponse } from '@models/reports/report-wall.model';
import { IReportPassStatisticResponse } from '@models/reports/report-pass-statistic.model';
import { IReportCompanyScoresResponse } from '@models/reports/report-company-scores.model';
import { IReportPersonalEfficiencyResponse } from '@models/reports/report-personal-efficiency.model';
import { IReportPersonalSkillsResponse } from '@models/reports/report-personal-skills.model';

import { type TCompanyReportQuery, type TPersonalReportQuery } from '@models/reports/report-common.model';


@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private httpClient: HttpClient) { }

    getReportWall(query: TCompanyReportQuery) {
        return this.httpClient.get<IReportWallResponse>(`/api/reports/wall/${query.companyId}`)
    }

    getReportPassStatistic(query: TCompanyReportQuery) {
        return this.httpClient.get<IReportPassStatisticResponse>(`/api/reports/pass-statistic/${query.companyId}`)
    }

    getReportCompanyScores(query: TCompanyReportQuery) {
        return this.httpClient.get<IReportCompanyScoresResponse>(`/api/reports/company-scores/${query.companyId}`)
    }

    getReportPersonalEfficiency(query: TPersonalReportQuery) {
        return this.httpClient.get<IReportPersonalEfficiencyResponse>(`/api/reports/personal-efficiency/${query.companyId}/${query.respondentId}`)
    }

    getReportPersonalSkills(query: TPersonalReportQuery) {
        return this.httpClient.get<IReportPersonalSkillsResponse>(`/api/reports/personal-skills/${query.companyId}/${query.respondentId}`)
    }

}
