import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Store } from '@ngrx/store';
import { actions, selectors } from 'src/app/store/reports/report-pass-statistic.store';
import { loadRequested } from 'src/app/store/data/data.actions';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';
import { filter, take } from 'rxjs'
import { colorDataset, datasetColorOptions } from '../../reports.util';


@Component({
    selector: 'app-report-pass-statistic',
    templateUrl: './report-pass-statistic.component.html',
    styleUrls: ['./report-pass-statistic.component.scss']
})
export class ReportPassStatisticComponent implements OnInit {

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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
                ticks: {
                    callback: function (value) {
                        return `${value}%`;
                    }
                }
            }
        },
        layout: {
            padding: {
                right: 50
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 14,
                        family: 'Roboto'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `${context.parsed.y}%`;
                        }
                        return label;
                    }
                }
            },
        },
    };

    data = this.store.select(selectors.getReportData).pipe(
        filter(data => !!data)
    )

    constructor(private readonly store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(loadRequested());

        this.store.select(getAuthorizedUser)
            .pipe(
                filter(value => !!value),
                take(1))
            .subscribe(user =>
                this.store.dispatch(actions.reportRequested({ query: { companyId: user!.companyId } })))

        this.data.subscribe(
            data => {

                const labels = data!.periods!.map(value => new Date(value).toLocaleDateString('ru'));

                const generatedByCompany = data!.periods!.map(period => ({
                    period,
                    value: data!.records
                        .filter(record => record.period === period)
                        .reduce((acc, cur) => acc + (cur.generated ?? 0), 0)
                }))

                /* console.log('generated', generatedByCompany); */

                const takenByCompany = data!.periods!.map(period => ({
                    period,
                    value: data!.records
                        .filter(record => record.period === period)
                        .reduce((acc, cur) => acc + (cur.taken ?? 0), 0)
                }))

                /* console.log('taken', takenByCompany); */

                const givenAnswersByCompany = data!.periods!.map(period => ({
                    period,
                    value: data!.records
                        .filter(record => record.period === period)
                        .reduce((acc, cur) => acc + (cur.givenAnswers ?? 0), 0)
                }))

                /* console.log('given', givenAnswersByCompany); */

                const generatedToTakenDataset = data!.periods!.map(value => {
                    const generated = generatedByCompany.find(element => element.period === value)?.value || 0;
                    const taken = takenByCompany.find(element => element.period === value)?.value || 0;

                    return generated ? Math.round(taken / generated * 100) : 0
                });

                const givenAnswersToTakenDataset = data!.periods!.map(value => {
                    const taken = takenByCompany.find(element => element.period === value)?.value || 0;
                    const givenAnswers = givenAnswersByCompany.find(element => element.period === value)?.value || 0;

                    const answersInSurvey = 10;

                    return taken ? Math.round(givenAnswers / (taken * answersInSurvey) * 100) : 0
                });

                this.lineChartData = {

                    datasets: [
                        {
                            data: generatedToTakenDataset,
                            label: ' Процент участия',
                            ...datasetColorOptions(colorDataset.pink)
                        },
                        {
                            data: givenAnswersToTakenDataset,
                            label: ' Процент ответов',
                            ...datasetColorOptions(colorDataset.indigo)
                        }
                    ],
                    labels
                };

                this.chart?.update();
            }
        )

    }
}