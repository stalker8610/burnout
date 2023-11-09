import { addDepartmentWithRespondent, addRespondent } from '../store/data/data.actions';
import { getCompanyId, getDepartments } from './../store/data/data.selectors';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IDepartment } from '@models/department.model';
import { IRespondent } from '@models/respondent.model';
import { Scopes } from '@models/user.model';
import { TObjectId, TWithId } from '@models/common.model';
import { Observable, of, startWith, map } from 'rxjs';
import { ICompany } from '@models/company.model';



@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
    userName = new FormControl('', { validators: [Validators.required] });
    email = new FormControl('', { validators: [Validators.required, Validators.email] });
    department = new FormControl<string | TWithId<IDepartment>>('');
    departments: TWithId<IDepartment>[] = [];
    companyId: TObjectId<ICompany> = '';

    filteredDepartments: Observable<IDepartment[]> = of([]);

    constructor(private store: Store) { }

    ngOnInit() {

        this.store.select(getCompanyId).subscribe(companyId =>
            this.companyId = companyId || '');

        this.store.select(getDepartments).subscribe(departments => {
            if (departments) {
                this.departments = departments;
                this.filteredDepartments = of(departments);
            }
        });

        this.filteredDepartments = this.department.valueChanges.pipe(
            startWith(''),
            map(value => {
                const title = typeof value === 'string' ? value : value?.title;
                return title ? this._filter(title) : this.departments.slice();
            }),
        );
    }

    displayFn(department: IDepartment): string {
        return department && department.title ? department.title : '';
    }

    private _filter(title: string): IDepartment[] {
        const filterValue = title.toLowerCase();
        return this.departments.filter(option => option.title.toLowerCase().includes(filterValue));
    }

    addRespondent() {

        console.log('Add new respondent');
        const nameParts = this.parseName(this.userName.value || '');

        const newRespondent: IRespondent = Object.assign({},
            nameParts,
            {
                companyId: this.companyId,
                email: this.email.value as string,
                scope: Scopes.User,
            })

        if (this.department.value) {
            if (typeof this.department.value === 'string') {
                const newDepartment: IDepartment = {
                    companyId: this.companyId,
                    title: this.department.value
                }
                this.store.dispatch(addDepartmentWithRespondent({ respondent: newRespondent, department: newDepartment }));
            } else if (typeof this.department.value === 'object') {
                newRespondent.departmentId = this.department.value._id
                this.store.dispatch(addRespondent(newRespondent));
            }
        } else {
            this.store.dispatch(addRespondent(newRespondent));
        }
    }

    newDepartmentWillBeCreated(): boolean {
        return !!(this.department.value && typeof this.department.value === 'string')
    }

    private parseName(name: string) {

        const result = {
            firstName: '',
            lastName: '',
            middleName: ''
        }

        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            result.lastName = nameParts[0]
        } else if (nameParts.length === 2) {
            result.lastName = nameParts[0];
            result.firstName = nameParts[1];
        } else {
            result.lastName = nameParts[0];
            result.firstName = nameParts[1];
            result.middleName = nameParts[2];
        }

        return result;

    }
}
