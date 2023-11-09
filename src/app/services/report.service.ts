import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractHttpService } from './http.service';
import { TObjectId } from '@models/common.model';
import { ICompany } from '@models/company.model';
import { IReportWallRecord } from '@models/reports/report-wall.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService extends AbstractHttpService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    getReportWall(companyId: TObjectId<ICompany>): Observable<IReportWallRecord[]> {
        return this.pipeRequest(
            this.httpClient.get(`/api/reports/wall/${companyId}`)
        );
    }

}
