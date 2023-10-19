import { TObjectId, TWithId, TWithData } from '../../models/common.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDepartment } from '@models/department.model';
import { IRespondent } from '@models/respondent.model';

import { of, Observable } from 'rxjs';

export type TTeammate = TWithData<TWithId<IRespondent>, IDepartment, 'department'> & {
    fullName: string
};
export type TTeam = TTeammate[];


@Injectable({
    providedIn: 'root'
})
export class DataService {

    team: TTeam = [
        {
            _id: '1',
            firstName: 'Вадим',
            lastName: 'Костин',
            fullName: 'Костин Вадим',
            email: 'kva@alexrovich.ru',
            department: {
                title: 'Отдел внедрения',
                companyId: 'mockCompany'
            },
            companyId: 'mockCompany'
        },
        {
            _id: '2',
            firstName: 'Олег',
            lastName: 'Долгов',
            fullName: 'Долгов Олег',
            email: 'oid@alexrovich.ru',
            department: {
                title: 'Технический отдел',
                companyId: 'mockCompany'
            },
            companyId: 'mockCompany'
        },
        {
            _id: '3',
            firstName: 'Артем',
            lastName: 'Ковтун',
            fullName: 'Ковтун Артем',
            email: 'kan@alexrovich.ru',
            department: {
                title: 'Технический отдел',
                companyId: 'mockCompany'
            },
            companyId: 'mockCompany'
        },
        {
            _id: '4',
            firstName: 'Максим',
            lastName: 'Фролов',
            fullName: 'Фролов Максим',
            email: 'mif@alexrovich.ru',
            department: {
                title: 'Технический отдел',
                companyId: 'mockCompany'
            },
            companyId: 'mockCompany'
        },
        {
            _id: '5',
            firstName: 'Вадим',
            lastName: 'Колымагин',
            fullName: 'Колымагин Вадим',
            email: 'vak@alexrovich.ru',
            department: {
                title: 'Отдел внедрения',
                companyId: 'mockCompany'
            },
            companyId: 'mockCompany'
        }
    ]

    teammate: TTeammate = {
        _id: '1',
        firstName: 'Вадим',
        lastName: 'Костин',
        fullName: 'Костин Вадим',
        email: 'kva@alexrovich.ru',
        department: {
            title: 'Отдел внедрения',
            companyId: 'mockCompany'
        },
        companyId: 'mockCompany'
    }

    constructor(private httpClient: HttpClient) { }

    getRespondent(respondentId: TObjectId<IRespondent>): TTeammate {
        return this.teammate;
    }

    getTeam(): TTeam {
        return this.team;
    }

    loadTeam(): Observable<TWithId<IRespondent>[]> {
        return of(this.team);
    }
}