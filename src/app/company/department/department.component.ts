import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TObjectId, TWithId } from '@models/common.model';
import { IDepartment } from '@models/department.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { isNotNull } from 'src/app/store/util';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent implements OnInit {

    @Input() department: Readonly<TWithId<IDepartment>> | null = null;
    @Input() hasRespondents = false;

    @Output('save') saveEvent = new EventEmitter<TWithId<Partial<IDepartment>>>();
    @Output('disable') disableEvent = new EventEmitter<TObjectId<IDepartment>>();

    formGroup = new FormGroup({
        title: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    });

    disable = new FormControl(false, { nonNullable: true });
    initialRawValue: ReturnType<typeof this.formGroup.getRawValue> | null = null;

    constructor() {
        this.disable.valueChanges.subscribe(
            value => value ? this.formGroup.disable() : this.formGroup.enable()
        )
    }

    ngOnInit() {
        if (isNotNull(this.department)) {
            this.formGroup.setValue({
                title: this.department.title
            });
            this.initialRawValue = this.formGroup.getRawValue();

            if (this.hasRespondents) {
                this.disable.disable();
            }
        }
    }

    save() {
        if (isNotNull(this.department)) {
            if (this.disable.value) {
                this.disableEvent.emit(this.department._id);
            } else {
                const formData = this.formGroup.getRawValue();
                const department: TWithId<Partial<IDepartment>> = {
                    _id: this.department._id,
                    title: formData.title,
                }
                this.saveEvent.emit(department);
            }
        }
    }

    getEmptyErrorMessage() {
        return 'Необходимо заполнить поле'
    }

    getRemoveActionName() {
        return 'Удалить отдел'
    }

    getRemoveActionHint() {
        return 'Отдел будет удален без возможности восстановления'
    }

    hasChanges() {
        return JSON.stringify(this.initialRawValue) !== JSON.stringify(this.formGroup.getRawValue());
    }

    shouldShowDisableHint() {
        return this.disable.value && this.disable.dirty;
    }

}
