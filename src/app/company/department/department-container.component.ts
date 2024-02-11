import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { DepartmentComponent } from "./department.component";
import { getDepartment, hasDepartmentRespondents } from "src/app/store/data/data.selectors";
import { isNotNull } from "src/app/store/util";
import { filter, first } from 'rxjs';
import { Store } from '@ngrx/store';
import { DataActions } from 'src/app/store/data/data.actions';
import { AsyncPipe } from "@angular/common";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IDepartment } from "@models/department.model";
import { TObjectId, TWithId } from "@models/common.model";

interface DialogData {
    departmentId: TObjectId<IDepartment>
}

@Component({
    selector: 'app-department-container',
    standalone: true,
    imports: [DepartmentComponent, AsyncPipe, MatDialogModule],
    templateUrl: './department-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentContainerComponent {

    department$;
    hasRespondents$;

    constructor(private store: Store, public dialogRef: MatDialogRef<DepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.department$ = this.store
            .select(getDepartment(data.departmentId))
            .pipe(filter(isNotNull), first());
        this.hasRespondents$ = this.store.select(hasDepartmentRespondents(data.departmentId, true)).pipe(first())
    }

    onSave(department: TWithId<Partial<IDepartment>>) {
        this.store.dispatch(DataActions.patchDepartment({ department }));
        this.dialogRef.close();
    }

    onDisable(departmentId: TObjectId<IDepartment>) {
        this.store.dispatch(DataActions.removeDepartment({ _id: departmentId }));
        this.dialogRef.close();
    }

}