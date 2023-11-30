import { addAlpha } from './../../reports.util';
import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { filter, take, map } from 'rxjs'
import { actions, selectors } from 'src/app/store/reports/report-company-scores.store';
import { Store } from '@ngrx/store';
import { loadRequested } from 'src/app/store/data/data.actions';
import { getAuthorizedUser } from 'src/app/store/auth/auth.selectors';
import { colorDataset } from '../../reports.util';

@Component({
    selector: 'app-report-company-scores',
    templateUrl: './report-company-scores.component.html',
    styleUrls: ['./report-company-scores.component.scss']
})
export class ReportCompanyScoresComponent {

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


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
                }
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
        datasets: {
            polarArea: {
                borderColor: "#fff"
            }
        }

    };

    data = this.store.select(selectors.getReportData).pipe(
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

    constructor(private readonly store: Store) {}

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
                const records = data!.records.slice();
                records.sort((a, b) => a.category.localeCompare(b.category));
                this.chartData = {
                    datasets: [{
                        data: records.map(record => Math.round(record.value / record.count * 100)),
                        label: ' Процент положительных ответов',
                        backgroundColor: [
                            ...['lime', 'indigo', 'green', 'deeporange', 'blue', 'pink', 'teal', 'bluegrey', 'purple', 'cyan', 'lightgreen', 'red', 'amber', 'brown' ]
                                .map(key => addAlpha(colorDataset[key].primary, 0.75))],
                        hoverBorderColor: '#fff'
                    }],
                    labels: records.map(record => record.category),
                }
                this.chart?.update();
            }
        )

    }
}