import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { filter, take } from 'rxjs'

import { Store } from '@ngrx/store';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';
import { actions, selectors } from 'src/app/store/reports/report-personal-efficiency.store';
import { PersonalFeedbackMood } from '@models/survey.model';
import { getPersonalFeedbackView } from 'src/app/store/data/data.util';
import { colorDataset } from '../../reports.util';

@Component({
    selector: 'app-report-personal-efficiency',
    templateUrl: './report-personal-efficiency.component.html',
    styleUrls: ['./report-personal-efficiency.component.scss']
})
export class ReportPersonalEfficiencyComponent {

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    constructor(private readonly store: Store) { }

    public chartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    public chartOptions: ChartConfiguration['options'] = {
        aspectRatio: 2,
        layout: {
            padding: {
                right: 50
            }
        },
        plugins: {
            legend: {
                position: 'right',
                align: 'start',
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
                        if (context.parsed !== null) {
                            label += `${context.parsed}%`;
                        }
                        return label;
                    }
                }
            },
        },
    };

    data = this.store.select(selectors.getReportData).pipe(
        filter(data => !!data),
    )

    ngOnInit(): void {

        this.store.select(getAuthorizedUser)
            .pipe(
                filter(value => !!value),
                take(1))
            .subscribe(user =>
                this.store.dispatch(actions.reportRequested({ query: { companyId: user!.companyId, respondentId: user!.respondentId } })))

        this.data
            .subscribe(
                data => {

                    const records = data!.rates.filter(rate => 'mood' in rate);

                    if (records.length) {
                        const ratesCount = new Array(Object.keys(PersonalFeedbackMood).length / 2).fill(0);

                        records.forEach(value => ratesCount[value.mood]++);
                        const total = ratesCount.reduce((acc, element) => acc + element, 0);

                        this.chartData = {
                            datasets: [{
                                data: ratesCount.map(count => Math.round(count / total * 100)),
                                label: ' Процент оценок',
                                backgroundColor: [
                                    colorDataset.deeporange.primary,
                                    colorDataset.lime.primary,
                                    colorDataset.pink.primary,
                                    colorDataset.green.primary,
                                    colorDataset.lightblue.primary,
                                ],
                                hoverBorderColor: '#fff'

                            }],
                            labels: ratesCount.map((count, index) => getPersonalFeedbackView(index)),

                        }
                        this.chart?.update();
                    }
                }
            )
    }

    getRateView(rate: PersonalFeedbackMood) {
        switch (rate) {
            case PersonalFeedbackMood.Sad: 'Очень плохо'
        }
    }
}
