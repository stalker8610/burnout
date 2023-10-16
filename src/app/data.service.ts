import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

/* import { ICompany, IDepartment, IUser} from '../types/company.types'; */


/* const mockUserChief: IUser = {
    firstName: 'Andrey',
    lastName: 'Alexandrovich',
    middleName: 'Andreevich',
    email: 'aaa@alexrovich.ru',
    birthDate: new Date('1987-08-21'),
    department: mockDepartment,
    position: string,
    isRemote: boolean,
    isActive: boolean,
    doSendSurveys: boolean,
    scope: Scopes,
    signUpStatus: SignUpStatus 
}

const mockCompany = {
    name: 'Alexrovich'
}

const mockDepartmentAdministration: IDepartment = {
    company: mockCompany,
    title: 'Administration',
    chief: mockUserChief,
    subDepartments: [
    ]
}

const mockDepartmentOV: IDepartment = {
    company: mockCompany,
    title: 'OV',
    chief: mockUserChief,
    subDepartments: [
    ]
}


const mockCompanyStructure: ICompanyStructure= {
    company: mockCompany,
    departments: [ {
        complany: mockCompany,
        title: 'marketing',
        chief: mockUserChief,
    }

    ]
} */


/* interface ICompanyStructure {
    company: ICompany,
    departments: IDepartment[],
    users: IUser[]
} */

export interface ITeammate {
    name: string,
    id: number,
    department: string
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    team: Array<ITeammate> = [
        { name: 'Костин Вадим Андреевич-Владиславович', id: 1, department: 'Отдел внедрения превнедрения-вабвалвла' },
        { name: 'Долгов Олег', id: 2 , department: 'Отдел внедрения'},
        { name: 'Ковтун Артем', id: 3 , department: 'Отдел внедрения'},
        { name: 'Фролов Максим', id: 4, department: 'Отдел внедрения' },
        { name: 'Капустян Михаил', id: 5, department: 'Отдел внедрения' },
        { name: 'Енгибарян Ваагн', id: 6, department: 'Отдел внедрения' },
        { name: 'Фролов Максим', id: 4 , department: 'Отдел внедрения'},
        { name: 'Капустян Михаил', id: 5 , department: 'Отдел внедрения'},
        { name: 'Енгибарян Ваагн', id: 6 , department: 'Отдел внедрения'},
        { name: 'Фролов Максим', id: 4 , department: 'Отдел внедрения'},
        { name: 'Капустян Михаил', id: 5 , department: 'Отдел внедрения'},
        { name: 'Енгибарян Ваагн', id: 6 , department: 'Отдел внедрения'}
    ]


    constructor(private httpClient: HttpClient) {
    }

    getTeam(): Observable<ITeammate[]> {
        return of(this.team);
    }

    /* getCompanyStructure(): ICompanyStructure {
        
    } */

}