import { filter, take, map } from 'rxjs';
import { getAuthorizedUser } from './../../store/auth/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReportData } from 'src/app/store/reports/report-wall/report-wall.selectors';
import { SelfMood } from '@models/survey.model';
import { reportRequested } from 'src/app/store/reports/report-wall/report-wall.actions';
import { concatLatestFrom } from '@ngrx/effects';
import { getTeam } from 'src/app/store/data/data.selectors';
import { concatRespondentName } from 'src/app/store/data/data.util';
import { loadRequested } from 'src/app/store/data/data.actions';

@Component({
    selector: 'app-report-wall',
    templateUrl: './report-wall.component.html',
    styleUrls: ['./report-wall.component.scss']
})
export class ReportWallComponent implements OnInit {

    SelfMood = SelfMood;
    records = this.store.select(getReportData).pipe(
        concatLatestFrom(() => this.store.select(getTeam(true))),
        filter(([records, team]) => !!records && !!team),
        map(([records, team]) =>
            records!.map(record => {
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

    images: Record<SelfMood, string> = {
        [SelfMood.Sad]: '/assets/images/wall/sad-mood.png',
        [SelfMood.Neutral]: '/assets/images/wall/neutral-mood.png',
        [SelfMood.Happy]: '/assets/images/wall/happy-mood.png',
    }

    constructor(private store: Store) { }

    ngOnInit(): void {
        
        this.store.dispatch(loadRequested());
        
        this.store.select(getAuthorizedUser)
            .pipe(
                filter(value => !!value),
                take(1))
            .subscribe(user =>
                this.store.dispatch(reportRequested({ companyId: user!.companyId })))
    }

    getDateView(date: string) {
        const now = new Date();
        const daysAgo = (now.valueOf() - new Date(date).valueOf()) / (60 * 60 * 24 * 1000);

        if (this.sameDay(new Date(date), now)) {
            return 'Сегодня'
        } else if (daysAgo < 1) {
            return 'Вчера'
        } else if (daysAgo < 7) {
            return 'Несколько дней назад'
        } else if (daysAgo < 12) {
            return 'Неделю назад'
        } else if (daysAgo < 20) {
            return 'Две недели назад'
        } else if (daysAgo < 30) {
            return 'Несколько недель назад'
        } else {
            return 'Более месяца назад'
        }
    }

    private sameDay(d1: Date, d2: Date) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

}