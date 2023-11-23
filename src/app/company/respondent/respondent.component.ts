import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TObjectId, TWithId } from '@models/common.model';
import { IRespondent, SignUpStatus } from '@models/respondent.model';
import { Store } from '@ngrx/store';
import { getDepartments, getRespondent } from 'src/app/store/data/data.selectors';
import { filter, map } from 'rxjs';
import { Scopes } from '@models/user.model';
import { IDepartment } from '@models/department.model';
import { getScopeView, getSignUpStatusView } from 'src/app/store/data/data.util';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { removeRespondent, patchRespondent } from 'src/app/store/data/data.actions';

export interface DialogData {
    respondentId: TObjectId<IRespondent>
}

@Component({
    selector: 'app-respondent',
    templateUrl: './respondent.component.html',
    styleUrls: ['./respondent.component.scss']
})
export class RespondentComponent implements OnInit {

    private readonly respondentId: TObjectId<IRespondent>;

    formGroup = new FormGroup({
        firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
        lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
        middleName: new FormControl('', { nonNullable: true }),
        email: new FormControl({ value: '', disabled: true }, { validators: [Validators.required, Validators.email], nonNullable: true }),
        birthDate: new FormControl('', { nonNullable: true }),
        department: new FormControl<TObjectId<IDepartment> | null>(null, { validators: [Validators.required] }),
        position: new FormControl('', { nonNullable: true }),
        isRemote: new FormControl(false, { nonNullable: true }),
        doSendSurveys: new FormControl(true, { nonNullable: true }),
        scope: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    }, { validators: [this.formGroupValidator] });

    disable = new FormControl(false, { nonNullable: true });

    availableScopes = [Scopes.User, Scopes.HR];
    signUpStatus: SignUpStatus | null = null;

    departments = this.store.select(getDepartments).pipe(
        map(value => value?.slice().sort((a, b) => a.title.localeCompare(b.title)))
    );

    initialRawValue: ReturnType<typeof this.formGroup.getRawValue> | null = null;
    waitingForApply = false;

    constructor(private store: Store, public dialogRef: MatDialogRef<RespondentComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.respondentId = data.respondentId;
    }

    ngOnInit() {
        this.disable.valueChanges.subscribe(
            value => value ? this.formGroup.disable() : this.formGroup.enable()
        )

        this.store
            .select(getRespondent(this.respondentId))
            .pipe(filter(value => !!value))
            .subscribe(
                (respondent => {
                    this.formGroup.controls.firstName.setValue(respondent!.firstName);
                    this.formGroup.controls.lastName.setValue(respondent!.lastName);
                    this.formGroup.controls.middleName.setValue(respondent!.middleName ?? '');
                    this.formGroup.controls.email.setValue(respondent!.email);

                    if (respondent!.birthDate) {
                        this.formGroup.controls.birthDate.setValue(respondent!.birthDate);
                    }

                    this.formGroup.controls.department.setValue(respondent!.departmentId ?? null);
                    this.formGroup.controls.position.setValue(respondent!.position ?? '');
                    this.formGroup.controls.isRemote.setValue(respondent!.isRemote ?? false);
                    this.formGroup.controls.doSendSurveys.setValue(respondent!.doSendSurveys ?? true);
                    this.formGroup.controls.scope.setValue(respondent!.scope);
                    this.disable.setValue(respondent!.signUpStatus === SignUpStatus.Disabled);
                    this.signUpStatus = respondent!.signUpStatus ?? SignUpStatus.NotInvitedYet;

                    this.initialRawValue = this.formGroup.getRawValue();

                    /* if (this.waitingForApply) {
                        setTimeout(() => this.dialogRef.close(), 1500);
                    } */
                })


            )
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

    save() {
        this.waitingForApply = true;
        if (this.disable.value) {
            this.store.dispatch(removeRespondent({ _id: this.respondentId }));
        } else {

            const formData = this.formGroup.getRawValue();

            const respondent: TWithId<Partial<IRespondent>> = {
                _id: this.respondentId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                middleName: formData.middleName,
                birthDate: formData.birthDate,
                departmentId: formData.department || '',
                position: formData.position,
                isRemote: formData.isRemote,
                doSendSurveys: formData.doSendSurveys,
                scope: formData.scope as Scopes
            }

            this.store.dispatch(patchRespondent({ respondent }));
        }
        this.dialogRef.close();

    }

    getEmailErrorMessage() {
        if (this.formGroup.controls.email.hasError('required')) {
            return this.getEmptyError();
        } else if (this.formGroup.controls.email.hasError('email')) {
            return 'Неверный формат';
        } else return '';
    }

    getEmptyError() {
        return 'Необходимо заполнить поле'
    }

    trackDepartmentById(index: number, item: TWithId<IDepartment>) {
        return item._id;
    }

    getScopeView = getScopeView;
    getSignUpStatusView = getSignUpStatusView;

    getRemoveActionName() {
        if (this.signUpStatus === SignUpStatus.SingedUp) {
            return 'Отключить учетную запись'
        } else {
            return 'Удалить учетную запись'
        }
    }

    getRemoveActionHint() {
        if (this.signUpStatus === SignUpStatus.SingedUp) {
            return 'Учетная запись будет отключена. Данные о прохождении опросов останутся, но сотрудник больше не сможет пользоваться сервисом'
        } else {
            return 'Учетная запись будет удалена' + (this.signUpStatus === SignUpStatus.Invited ? ', отправленное приглашение аннулировано' : '')
        }
    }

    shouldShowDisableHint() {
        return this.disable.value && this.disable.dirty;
    }

}


