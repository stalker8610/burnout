import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Store } from '@ngrx/store';
import { getReportData } from 'src/app/store/reports/report-pass-statistic/report-pass-statistic.selectors';
import { concatLatestFrom } from '@ngrx/effects';
/* import Annotation from 'chartjs-plugin-annotation'; */
import { getDepartments } from 'src/app/store/data/data.selectors';
import { loadRequested } from 'src/app/store/data/data.actions';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';
import { filter, take, map } from 'rxjs'
import { reportRequested } from 'src/app/store/reports/report-pass-statistic/report-pass-statistic.actions';

@Component({
    selector: 'app-report-pass-statistic',
    templateUrl: './report-pass-statistic.component.html',
    styleUrls: ['./report-pass-statistic.component.scss']
})
export class ReportPassStatisticComponent implements OnInit {

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public lineChartType: ChartType = 'line';

    public lineChartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    public lineChartOptions: ChartConfiguration['options'] = {
        elements: {
            line: {
                tension: 0.5,
            },
        },
        scales: {
            y: {
                position: 'left',
                min: 0,
                /* max: 100 */
            }
        },

        plugins: {
            /* legend: { display: false }, */
            /* tooltip: { enabled: false }, */
        },
    };

    data = this.store.select(getReportData).pipe(
        filter(data => !!data),
        /* concatLatestFrom(() => this.store.select(getDepartments)),
        map(([data, departments]) => ({
            ...data,
            records: data!.records.map(record => ({
                ...record,
                department: departments!.find(department => department._id === record.departmentId)
            }))
        })) */
    )

    constructor(private readonly store: Store) {
        Chart.register(/* Annotation, */ Colors);
    }

    ngOnInit(): void {
        this.store.dispatch(loadRequested());

        this.store.select(getAuthorizedUser)
            .pipe(
                filter(value => !!value),
                take(1))
            .subscribe(user =>
                this.store.dispatch(reportRequested({ companyId: user!.companyId })))

        this.data.subscribe(
            data => {

                console.log(data);

                const labels = data!.periods!.map(value => new Date(value).toLocaleDateString('ru'));

                const generatedByCompany = data!.periods!.map(period => ({
                    period,
                    value: data!.records
                        .filter(record => record.period === period)
                        .reduce((acc, cur) => acc + (cur.generated ?? 0), 0)
                }))

                console.log('generated', generatedByCompany);

                const takenByCompany = data!.periods!.map(period => ({
                    period,
                    value: data!.records
                        .filter(record => record.period === period)
                        .reduce((acc, cur) => acc + (cur.taken ?? 0), 0)
                }))

                console.log('taken', takenByCompany);

                const givenAnswersByCompany = data!.periods!.map(period => ({
                    period,
                    value: data!.records
                        .filter(record => record.period === period)
                        .reduce((acc, cur) => acc + (cur.givenAnswers ?? 0), 0)
                }))

                console.log('given', givenAnswersByCompany);

                const generatedToTakenDataset = data!.periods!.map(value => {
                    const generated = generatedByCompany.find(element => element.period === value)?.value || 0;
                    const taken = takenByCompany.find(element => element.period === value)?.value || 0;

                    return generated ? taken / generated * 100 : 0
                });

                const givenAnswersToTakenDataset = data!.periods!.map(value => {
                    const taken = takenByCompany.find(element => element.period === value)?.value || 0;
                    const givenAnswers = givenAnswersByCompany.find(element => element.period === value)?.value || 0;

                    const answersInSurvey = 10;

                    return taken ? givenAnswers / (taken * answersInSurvey) * 100 : 0
                });

                this.lineChartData = {

                    datasets: [
                        {
                            data: generatedToTakenDataset,
                            label: 'Процент участия',
                            /* backgroundColor: 'rgba(148,159,177,0.2)',
                            borderColor: 'rgba(148,159,177,1)',
                            pointBackgroundColor: 'rgba(148,159,177,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(148,159,177,0.8)' */
                        },
                        {
                            data: givenAnswersToTakenDataset,
                            label: 'Процент ответов',
                            /* backgroundColor: 'rgba(77,83,96,0.2)',
                            borderColor: 'rgba(77,83,96,1)',
                            pointBackgroundColor: 'rgba(77,83,96,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(77,83,96,1)', */
                            
                        }
                    ],
                    labels
                };

                this.chart?.update();
            }
        )

    }
}