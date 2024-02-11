import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TObjectId, TWithId } from '@models/common.model';
import { IRespondent, SignUpStatus } from '@models/respondent.model';
import { Scopes } from '@models/user.model';
import { IDepartment } from '@models/department.model';
import { getScopeView, getSignUpStatusView } from 'src/app/store/data/data.util';
import { isNotNull } from 'src/app/store/util';
import { EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-respondent',
    templateUrl: './respondent.component.html',
    styleUrls: ['./respondent.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        NgFor
    ]
})
export class RespondentComponent implements OnInit {

    @Input() respondent: Readonly<TWithId<IRespondent>> | null = null;
    @Input() departments: ReadonlyArray<TWithId<IDepartment>> = [];

    @Output('save') saveEvent = new EventEmitter<TWithId<Partial<IRespondent>>>();
    @Output('disable') disableEvent = new EventEmitter<TObjectId<IRespondent>>();

    formGroup = new FormGroup({
        firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
        lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
        middleName: new FormControl('', { nonNullable: true }),
        email: new FormControl({ value: '', disabled: true }, { validators: [Validators.required, Validators.email], nonNullable: true }),
        birthDate: new FormControl<string | null>(null),
        department: new FormControl<TObjectId<IDepartment> | null>(null, { validators: [Validators.required] }),
        position: new FormControl('', { nonNullable: true }),
        /* isRemote: new FormControl(false, { nonNullable: true }), */
        doSendSurveys: new FormControl(true, { nonNullable: true }),
        scope: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    });

    disable = new FormControl(false, { nonNullable: true });

    availableScopes: ReadonlyArray<Scopes> = [Scopes.User, Scopes.HR];
    signUpStatus: SignUpStatus | null = null;
    initialRawValue: ReturnType<typeof this.formGroup.getRawValue> | null = null;

    ngOnInit() {

        if (isNotNull(this.respondent)) {

            this.formGroup.setValue({
                firstName: this.respondent.firstName,
                lastName: this.respondent.lastName,
                middleName: this.respondent.middleName ?? '',
                email: this.respondent.email,
                birthDate: this.respondent.birthDate ?? null,
                department: this.respondent.departmentId ?? null,
                position: this.respondent.position ?? '',
                /* isRemote: this.respondent.isRemote ?? false, */
                doSendSurveys: this.respondent.doSendSurveys ?? true,
                scope: this.respondent.scope
            })

            this.signUpStatus = this.respondent.signUpStatus ?? SignUpStatus.NotInvitedYet;
            this.initialRawValue = this.formGroup.getRawValue();

            this.disable.setValue(this.respondent.signUpStatus === SignUpStatus.Disabled);
            this.disable.valueChanges.subscribe(
                value => value ? this.formGroup.disable() : this.formGroup.enable()
            )

        }
    }

    hasChanges() {
        return JSON.stringify(this.initialRawValue) !== JSON.stringify(this.formGroup.getRawValue());
    }

    save() {
        if (isNotNull(this.respondent)) {
            if (this.disable.value) {
                this.disableEvent.emit(this.respondent._id);
            } else {
                const formData = this.formGroup.getRawValue();
                const respondent: TWithId<Partial<IRespondent>> = {
                    _id: this.respondent._id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    middleName: formData.middleName,
                    birthDate: formData.birthDate ?? '',
                    departmentId: formData.department ?? '',
                    position: formData.position,
                    /* isRemote: formData.isRemote, */
                    isRemote: this.respondent.isRemote,
                    doSendSurveys: formData.doSendSurveys,
                    scope: formData.scope as Scopes
                }
                this.saveEvent.emit(respondent);
            }
        }
    }

    getEmailErrorMessage() {
        if (this.formGroup.controls.email.hasError('required')) {
            return this.getEmptyErrorMessage();
        } else if (this.formGroup.controls.email.hasError('email')) {
            return 'Неверный формат';
        } else return '';
    }

    getEmptyErrorMessage() {
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


