import { Component, Input } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { EmptyStateEmitable, IQuestionComponent } from '../question.interface';
import { CompanyQuestionInputData } from '../question.interface';
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
export class QuestionCardCompanyComponent extends EmptyStateEmitable implements IQuestionComponent {

    @Input() inputData!: CompanyQuestionInputData;
    readonly maxScore = 10;
    score = 0;

    choice(i: number) {
        this.score = i + 1;
        this.checkEmptyAnswer();
    }

    trackByFn = (index: number) => index;

    get answer(): TAnswerCompany {
        return {
            score: this.score
        }
    }

    isAnswerEmpty(): boolean {
        return this.score === 0
    }

}
