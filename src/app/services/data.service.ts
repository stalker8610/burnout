
import { TObjectId, TWithId, TWithData } from '@models/common.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDepartment } from '@models/department.model';
import { IRespondent, INewRespondent } from '@models/respondent.model';
import { ICompany, TCompanyStructure } from '@models/company.model';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private httpClient: HttpClient) { }

    addRespondent(companyId: TObjectId<ICompany>, data: INewRespondent) {
        return this.httpClient.post<TWithId<IRespondent>>(`/api/respondents/${companyId}`, data)
    }

    patchRespondent(companyId: TObjectId<ICompany>, data: TWithId<Partial<IRespondent>>) {
        return this.httpClient.put<TWithId<IRespondent>>(`/api/respondents/${companyId}/${data._id}`, data)
    }

    removeRespondent(companyId: TObjectId<ICompany>, respondentId: TObjectId<IRespondent>) {
        return this.httpClient.delete<Pick<TWithId<IRespondent>, '_id'>>(`/api/respondents/${companyId}/${respondentId}`)
    }

    deactivateRespondent(companyId: TObjectId<ICompany>, respondentId: TObjectId<IRespondent>) {
        return this.httpClient.post<TWithId<IRespondent>>(`/api/respondents/${companyId}/${respondentId}/deactivate`, {})
    }

    addDepartment(companyId: TObjectId<ICompany>, data: IDepartment) {
        return this.httpClient.post<TWithId<IDepartment>>(`/api/departments/${companyId}`, data)
    }

    patchDepartment(companyId: TObjectId<ICompany>, data: TWithId<Partial<IDepartment>>) {
        return this.httpClient.put<TWithId<IDepartment>>(`/api/departments/${companyId}/${data._id}`, data)
    }

    removeDepartment(companyId: TObjectId<ICompany>, departmentId: TObjectId<IRespondent>) {
        return this.httpClient.delete<Pick<TWithId<IDepartment>, '_id'>>(`/api/departments/${companyId}/${departmentId}`)
    }

    loadData(companyId: TObjectId<ICompany>) {
        return this.httpClient.get<TCompanyStructure>(`/api/companies/${companyId}/structure`);
    }
}