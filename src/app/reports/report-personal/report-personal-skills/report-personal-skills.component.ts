import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { filter, take } from 'rxjs'

import { Store } from '@ngrx/store';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';
import { actions, selectors } from 'src/app/store/reports/report-personal-skills.store';
import { addAlpha, colorDataset } from '../../reports.util';
@Component({
    selector: 'app-report-personal-skills',
    templateUrl: './report-personal-skills.component.html',
    styleUrls: ['./report-personal-skills.component.scss']
})
export class ReportPersonalSkillsComponent {

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    constructor(private readonly store: Store) { }

    public chartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    public chartOptions: ChartConfiguration['options'] = {
        elements: {
            line: {
                tension: 0,
            },
        },
        aspectRatio: 2,
        layout: {
            padding: {
                right: 50
            },
        },
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                    callback: function (value) {
                        return `${value}%`;
                    }
                }

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
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.r !== null) {
                            label += `${context.parsed.r}%`;
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
                    const records = data!.skills.slice();

                    if (records.length) {

                        records.sort((a, b) => a.category.localeCompare(b.category));

                        const ratings = records.map(skill => skill.score);
                        const socialCapitals = records.map(skill => skill.positive);
                        const skills = records.map(skill => skill.score >= 1 ? skill.positive / skill.count * 100 : 0);


                        this.chartData = {
                            datasets: [{
                                data: skills,
                                label: ' Навык',
                                backgroundColor: addAlpha(colorDataset.indigo.primary, 0.12),
                                borderColor: colorDataset.indigo.primary,
                                pointBackgroundColor: colorDataset.indigo.primary,
                                hoverBorderColor: '#fff'

                            }],
                            labels: records.map(skill => skill.category),

                        }
                        this.chart?.update();
                    }
                }
            )

    }


}
