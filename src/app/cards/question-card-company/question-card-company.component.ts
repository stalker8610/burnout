import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { QuestionComponent } from '../question.interface';
import { BehaviorSubject } from 'rxjs';
import { CompanyQuestionInputData } from 'src/app/survey/survey.component';
import { TAnswerCompany } from '@models/survey.model';

@Component({
    selector: 'app-question-card-company',
    templateUrl: './question-card-company.component.html',
    styleUrls: ['./question-card-company.component.scss'],
    animations: [
        trigger('chosen', [
            state('chosen', style({
                opacity: 1,
            })),
            state('regular', style({
                opacity: 0.3,
            })),
            transition('chosen => regular', [
                animate('0.1s')
            ]),
            transition('regular => chosen', [
                animate('0.1s')
            ]),
        ]),
    ]
})
export class QuestionCardCompanyComponent implements QuestionComponent {

    @Input() inputData!: CompanyQuestionInputData;
    readonly maxScore = 10;
    score = 0;
    emptyAnswer = new BehaviorSubject<boolean>(true);

    choice(i: number) {
        this.score = i + 1;
        this.updateEmptyAnswerState();
    }

    trackByFn = (index: number) => index;

    confirmAnswer(): TAnswerCompany {
        return {
            score: this.score
        }
    }

    updateEmptyAnswerState() {
        const emptyAnswer = this.score === 0;
        this.emptyAnswer.next(emptyAnswer);
    }

}
