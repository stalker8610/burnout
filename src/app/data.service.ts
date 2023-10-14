import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

@Injectable({
    providedIn: 'root'
})
export class DataService {


    constructor(private httpClient: HttpClient){
    }

    /* getCompanyStructure(): ICompanyStructure {
        
    } */

}