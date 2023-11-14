import { addRespondentRequest, loadRequested } from '../../store/data/data.actions';
import { getDepartments } from '../../store/data/data.selectors';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IDepartment } from '@models/department.model';
import { TWithId } from '@models/common.model';
import { Observable, of, startWith, map, switchMap, filter } from 'rxjs';

import { TNewResponentToCreate } from '../../store/data/data.actions';

@Component({
    selector: 'app-company-edit',
    templateUrl: './company-edit.component.html',
    styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {
    userName = new FormControl('', { validators: [Validators.required] });
    email = new FormControl('', { validators: [Validators.required, Validators.email] });
    department = new FormControl<string | TWithId<IDepartment>>('', { validators: [Validators.required] });

    filteredDepartments$: Observable<IDepartment[]> = of([]);

    constructor(private store: Store) { }

    ngOnInit() {
        this.store.dispatch(loadRequested());
        this.filteredDepartments$ = this.store.select(getDepartments).pipe(
            filter(departments => !!departments && !!departments.length),
            switchMap(departments => this.department.valueChanges.pipe(
                startWith(''),
                switchMap(value => typeof value === 'string' ? of(value) : of(value?.title)),
                map((substring) => substring ? this._filter(departments!, substring) : departments!.slice()),
                map(departments => departments.sort((a, b) => a.title.localeCompare(b.title)))
            ))
        )
    }

    displayFn(department: IDepartment): string {
        return department && department.title ? department.title : '';
    }

    private _filter(departments: IDepartment[], substring: string): IDepartment[] {
        const substringToSearch = substring.toLowerCase();
        return departments.filter(option => option.title.toLowerCase().includes(substringToSearch));
    }

    addRespondent() {
        let newRespondent: TNewResponentToCreate;
        let newRespondentBase = {
            name: this.userName.value!,
            email: this.email.value!,
        }
        if (typeof this.department.value === 'object') {
            newRespondent = Object.assign({}, newRespondentBase, {
                departmentId: this.department.value!._id
            })
        } else {
            newRespondent = Object.assign({}, newRespondentBase, {
                newDepartmentTitle: this.department.value!
            })
        }
        this.store.dispatch(addRespondentRequest({ respondent: newRespondent }));
        this.resetForm();
    }

    newDepartmentWillBeCreated(): boolean {
        return !!(this.department.value && typeof this.department.value === 'string')
    }

    resetForm() {
        this.userName.reset();
        this.email.reset();
        this.department.reset();
    }
}
