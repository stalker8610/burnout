import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TObjectId, TWithId } from '@models/common.model';
import { Store } from '@ngrx/store';
import { IDepartment } from '@models/department.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { removeDepartment, patchDepartment } from 'src/app/store/data/data.actions';
import { getDepartment, getRespondentsOfDepartment } from 'src/app/store/data/data.selectors';
import { filter, map, Observable } from 'rxjs';
import { IRespondent } from '@models/respondent.model';

interface DialogData {
    departmentId: TObjectId<IDepartment>
}

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
    private readonly departmentId: TObjectId<IDepartment>;
    hasRespondents;

    formGroup = new FormGroup({
        title: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    }, { validators: [this.formGroupValidator] });

    disable = new FormControl(false, { nonNullable: true });
    initialRawValue: ReturnType<typeof this.formGroup.getRawValue> | null = null;

    constructor(private store: Store, public dialogRef: MatDialogRef<DepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.departmentId = data.departmentId;
        this.hasRespondents = this.store.select(getRespondentsOfDepartment(this.departmentId, true))
            .pipe(
                map(respondents => !!respondents && respondents.length)
            )
            .subscribe(value => {
                if (value) {
                    this.disable.disable();
                }
            })

        this.disable.valueChanges.subscribe(
            value => value ? this.formGroup.disable() : this.formGroup.enable()
        )

        this.store
            .select(getDepartment(this.departmentId))
            .pipe(filter(value => !!value))
            .subscribe(
                (department => {
                    this.formGroup.controls.title.setValue(department!.title);

                    //this.disable.setValue(respondent!.signUpStatus === SignUpStatus.Disabled);
                    this.initialRawValue = this.formGroup.getRawValue();

                    /* if (this.waitingForApply) {
                        setTimeout(() => this.dialogRef.close(), 1500);
                    } */
                })
            )
    }

    ngOnInit() {
    }

    save() {
        //        this.waitingForApply = true;
        if (this.disable.value) {
            this.store.dispatch(removeDepartment({ _id: this.departmentId }));
        } else {

            const formData = this.formGroup.getRawValue();

            const department: TWithId<Partial<IDepartment>> = {
                _id: this.departmentId,
                title: formData.title,
            }

            this.store.dispatch(patchDepartment({ department }));
        }
        this.dialogRef.close();

    }
    getEmptyError() {
        return 'Необходимо заполнить поле'
    }

    getRemoveActionName() {
        return 'Удалить отдел'
    }

    getRemoveActionHint() {
        return 'Отдел будет удален без возможности восстановления'
    }

    formGroupValidator(formGroup: AbstractControl) {

        const controls = Object.keys((formGroup as FormGroup).controls);

        const isFormInvalid = controls.reduce((prev, curr) => {
            const control = (formGroup as FormGroup).controls[curr];
            return prev || control.invalid;
        }, false);

        return isFormInvalid ? { formInvalid: true } : null
    }

    hasChanges() {
        return JSON.stringify(this.initialRawValue) !== JSON.stringify(this.formGroup.getRawValue());
    }

    shouldShowDisableHint() {
        return this.disable.value && this.disable.dirty;
    }


}
