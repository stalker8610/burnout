import { filter, take, map, combineLatest } from 'rxjs';
import { getAuthorizedUser } from './../../store/auth/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions, selectors as reportSelectors } from 'src/app/store/reports/report-wall.store';
import * as dataSelectors from 'src/app/store/data/data.selectors';

import { getTeam } from 'src/app/store/data/data.selectors';
import { concatRespondentName } from 'src/app/store/data/data.util';
import { DataActions } from 'src/app/store/data/data.actions';

@Component({
    selector: 'app-report-wall',
    templateUrl: './report-wall.component.html',
    styleUrls: ['./report-wall.component.scss'],
})
export class ReportWallComponent implements OnInit {

    
    loaded = combineLatest([
        this.store.select(reportSelectors.getLoaded),
        this.store.select(dataSelectors.getLoaded)])
        .pipe(
            map(([reportLoaded, dataLoaded]) => reportLoaded && dataLoaded)
        )

    records = combineLatest([
        this.store.select(reportSelectors.getReportData),
        this.store.select(getTeam(true))])
        .pipe(
            filter(([data, team]) => !!data && !!team),
            map(([data, team]) =>
                data!.records.map(record => {
                    let respondent = '';
                    if (record.respondentId) {
                        respondent = concatRespondentName(team!.find(teammate => teammate._id === record!.respondentId)!)
                    }
                    return {
                        ...record,
                        respondent
                    }
                }))
        );

    

    constructor(private store: Store) { }

    ngOnInit(): void {

        this.store.dispatch(DataActions.loadRequested());

        this.store.select(getAuthorizedUser)
            .pipe(
                filter(value => !!value),
                take(1))
            .subscribe(user =>
                this.store.dispatch(actions.reportRequested({ query: { companyId: user!.companyId } })))
    }

    

}