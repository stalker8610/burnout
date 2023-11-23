
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TObjectId } from '@models/common.model';
import { ICompany } from '@models/company.model';
import { IReportWallRecord } from '@models/reports/report-wall.model';
import { IReportPassStatisticResponse } from '@models/reports/report-pass-statistic.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private httpClient: HttpClient) { }

    getReportWall(companyId: TObjectId<ICompany>) {
        return this.httpClient.get<IReportWallRecord[]>(`/api/reports/wall/${companyId}`)
    }

    getReportPassStatistic(companyId: TObjectId<ICompany>) {
        return this.httpClient.get<IReportPassStatisticResponse>(`/api/reports/pass-statistic/${companyId}`)
    }

}
