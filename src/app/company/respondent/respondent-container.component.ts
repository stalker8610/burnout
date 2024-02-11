
import { Component, Inject } from "@angular/core";
import { RespondentComponent } from "./respondent.component";
import { IRespondent } from "@models/respondent.model";
import { TObjectId, TWithId } from "@models/common.model";
import { first, map } from "rxjs";

import { Store } from '@ngrx/store';
import { getDepartments, getRespondent } from 'src/app/store/data/data.selectors';
import { DataActions } from 'src/app/store/data/data.actions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncPipe } from "@angular/common";

interface DialogData {
    respondentId: TObjectId<IRespondent>
}

@Component({
    selector: 'app-respondent-container',
    templateUrl: './respondent-container.component.html',
    standalone: true,
    imports: [RespondentComponent, AsyncPipe]
})
export class RespondentContainerComponent {

    respondent$;

    departments$ = this.store.select(getDepartments).pipe(
        map(value => value.slice().sort((a, b) => a.title.localeCompare(b.title))),
        first()
    );

    constructor(private store: Store, public dialogRef: MatDialogRef<RespondentComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.respondent$ = this.store
            .select(getRespondent(data.respondentId))
            .pipe(first())
    }

    onSave(respondent: TWithId<Partial<IRespondent>>) {
        this.store.dispatch(DataActions.patchRespondent({ respondent }));
        this.dialogRef.close();
    }

    onDisable(respondentId: TObjectId<IRespondent>) {
        this.store.dispatch(DataActions.removeRespondent({ _id: respondentId }));
        this.dialogRef.close();
    }


}