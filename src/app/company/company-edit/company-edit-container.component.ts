import { CompanyEditComponent } from './company-edit.component';
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DataActions, type TNewResponentToCreate } from 'src/app/store/data/data.actions';
import { getDepartments } from '../../store/data/data.selectors';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
    selector: 'app-company-edit-container',
    standalone: true,
    template: '<app-company-edit [departments]="departments$ | async" (addRespondent)="onAddRespondent($event)"></app-company-edit>',
    imports: [CompanyEditComponent, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyEditContainerComponent implements OnInit {

    departments$ = this.store.select(getDepartments).pipe(
        map(arr => arr
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title)))
    );

    constructor(private store: Store) { }

    ngOnInit() {
        this.store.dispatch(DataActions.loadRequested());
    }

    onAddRespondent(respondent: TNewResponentToCreate) {
        this.store.dispatch(DataActions.addRespondentRequest({ respondent }));
    }

}