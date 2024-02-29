import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelfMood } from '@models/survey.model';

@Component({
    selector: 'app-report-wall-record',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './report-wall-record.component.html',
    styleUrls: ['./report-wall-record.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportWallRecordComponent {

    @Input() mood?: SelfMood;
    @Input() date = '';
    @Input() text = '';
    @Input() respondent = '';

    SelfMood = SelfMood;

    images: Record<SelfMood, string> = {
        [SelfMood.Sad]: '/assets/images/wall/sad-mood.png',
        [SelfMood.Neutral]: '/assets/images/wall/neutral-mood.png',
        [SelfMood.Happy]: '/assets/images/wall/happy-mood.png',
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
