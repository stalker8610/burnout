import { Component, OnInit, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDepartment } from '@models/department.model';
import { TWithId } from '@models/common.model';
import { type TNewResponentToCreate } from 'src/app/store/data/data.actions';
import { EventEmitter } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { switchMap, of, BehaviorSubject, startWith, Observable, combineLatest } from 'rxjs';

type TDepartmentsArray = ReadonlyArray<TWithId<IDepartment>>;

@Component({
    selector: 'app-company-edit',
    templateUrl: './company-edit.component.html',
    styleUrls: ['./company-edit.component.scss'],
    imports: [NgFor, NgIf, AsyncPipe, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyEditComponent implements OnInit {

    departments$: BehaviorSubject<TDepartmentsArray> = new BehaviorSubject<TDepartmentsArray>([]);
    @Input() set departments(arr: TDepartmentsArray | null) {
        this.departments$.next(arr || []);
    }
    @Output('addRespondent') addRespondentEvent = new EventEmitter<TNewResponentToCreate>();

    formGroup = new FormGroup({
        userName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
        email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
        department: new FormControl<string | TWithId<IDepartment>>('', { validators: [Validators.required], nonNullable: true }),
    })

    filteredDepartments$: Observable<TDepartmentsArray> = of([]);

    ngOnInit() {
        this.filteredDepartments$ = combineLatest([
            this.departments$,
            this.formGroup.controls.department.valueChanges.pipe(
                startWith(''),
                switchMap(value => typeof value === 'string' ? of(value) : of(value.title))
            )])
            .pipe(
                switchMap(([departments, substr]) =>
                    substr
                        ? of(departments.filter(option => option.title.match(new RegExp(substr, 'i'))))
                        : of(departments)
                ))
    }

    displayFn(department: IDepartment) {
        return department && department.title ? department.title : '';
    }

    addRespondent() {

        const { userName: name, email, department } = this.formGroup.getRawValue();

        let newRespondent: TNewResponentToCreate;
        let newRespondentBase = { name, email };

        if (typeof department === 'object') {
            newRespondent = Object.assign(newRespondentBase, {
                departmentId: department._id
            })
        } else {
            newRespondent = Object.assign(newRespondentBase, {
                newDepartmentTitle: department
            })
        }

        this.addRespondentEvent.emit(newRespondent);
        this.formGroup.reset();
    }

    newDepartmentWillBeCreated(): boolean {
        const { department } = this.formGroup.getRawValue();
        return typeof department === 'string' && !!department;
    }

    getErrorText(controlName: 'userName' | 'email' | 'department') {
        const control = this.formGroup.controls[controlName];
        if (control.hasError('required')) {
            return 'Заполните поле'
        } else if (control.hasError('email')) {
            return 'Неверный формат'
        } else return ''
    }

}
