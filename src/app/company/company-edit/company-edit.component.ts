import { DataActions, type TNewResponentToCreate } from 'src/app/store/data/data.actions';
import { getDepartments } from '../../store/data/data.selectors';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDepartment } from '@models/department.model';
import { TWithId } from '@models/common.model';
import { Observable, of, startWith, map, switchMap, filter } from 'rxjs';

@Component({
    selector: 'app-company-edit',
    templateUrl: './company-edit.component.html',
    styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

    formGroup = new FormGroup({
        userName: new FormControl('', { validators: [Validators.required] }),
        email: new FormControl('', { validators: [Validators.required, Validators.email] }),
        department: new FormControl<string | TWithId<IDepartment>>('', { validators: [Validators.required] }),
    })

    filteredDepartments$: Observable<IDepartment[]> = of([]);

    constructor(private store: Store) { }

    ngOnInit() {
        this.store.dispatch(DataActions.loadRequested());
        this.filteredDepartments$ = this.store.select(getDepartments).pipe(
            filter(departments => !!departments && !!departments.length),
            switchMap(departments => this.formGroup.controls.department.valueChanges.pipe(
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
            name: this.formGroup.controls.userName.value!,
            email: this.formGroup.controls.email.value!,
        }
        if (typeof this.formGroup.controls.department.value === 'object') {
            newRespondent = Object.assign({}, newRespondentBase, {
                departmentId: this.formGroup.controls.department.value!._id
            })
        } else {
            newRespondent = Object.assign({}, newRespondentBase, {
                newDepartmentTitle: this.formGroup.controls.department.value!
            })
        }
        this.store.dispatch(DataActions.addRespondentRequest({ respondent: newRespondent }));
        this.resetForm();
    }

    newDepartmentWillBeCreated(): boolean {
        return !!(this.formGroup.controls.department.value && typeof this.formGroup.controls.department.value === 'string')
    }

    getErrorText(controlName: 'userName' | 'email' | 'department') {
        const control = this.formGroup.controls[controlName];
        if (control.hasError('required')) {
            return 'Заполните поле'
        } else if (control.hasError('email')) {
            return 'Неверный формат'
        } else return ''
    }

    resetForm() {
        this.formGroup.reset();
        /* this.formGroup.controls.email.reset();
        this.formGroup.controls.department.reset(); */
    }
}
