import { Component, Input, ViewChild, ComponentRef, Output, EventEmitter, OnInit } from '@angular/core';
import { QuestionDirective } from '../question.directive';
import { QuestionComponent } from '../question.interface';

import { distinctUntilChanged, Observable, of } from 'rxjs';
import { QuestionItem } from '../../survey/survey.component';
import { TTeam } from '../../services/data.service';

@Component({
    selector: 'app-question-card-container',
    templateUrl: './question-card-container.component.html',
    styleUrls: ['./question-card-container.component.scss']
})
export class QuestionCardContainerComponent implements OnInit {

    @Input() team: TTeam = []
    @Input() questions: QuestionItem[] = [];

    @Input() onAnswerConfirmed: (data: any) => Observable<any> = () => of();
    @Input() onQuestionSkipped: (data: any) => Observable<any> = () => of();
    
    @Output() errorOccured = new EventEmitter<string>();
    @Output() surveyCompleted = new EventEmitter<void>();

    questionIndex: number = 0;
    title = '';
    subtitle = '';

    private componentRef!: ComponentRef<QuestionComponent>;

    @ViewChild(QuestionDirective, { static: true }) questionHost!: QuestionDirective;

    anonymous = false;
    emptyAnswer = true;

    blockInterface = false;

    ngOnInit(): void {
        this.embedQuestionComponent();
    }

    embedQuestionComponent() {

        //clear checkbox
        this.anonymous = false;

        const questionItem = this.questions[this.questionIndex];
        const viewContainerRef = this.questionHost.viewContainerRef;
        viewContainerRef.clear();

        this.componentRef = viewContainerRef.createComponent<QuestionComponent>(questionItem.component);
        this.componentRef.instance.inputData = questionItem.data;
        this.componentRef.instance.emptyAnswer?.pipe(distinctUntilChanged()).
            subscribe(value => this.emptyAnswer = value);

        this.title = 'title' in questionItem.data ? questionItem.data.title : '';
        this.subtitle = 'subtitle' in questionItem.data ? questionItem.data.subtitle : '';
    }

    nextQuestion() {
        if (this.questionIndex !== this.questions.length - 1) {
            this.questionIndex++;
            this.embedQuestionComponent();
        } else {
            this.surveyCompleted.emit();
        }
    }

    confirmAnswer() {
        const answer = this.componentRef.instance.confirmAnswer();
        this.blockInterface = true;
        this.onAnswerConfirmed({
            questionId: this.questions[this.questionIndex].data.questionId,
            anonymous: this.anonymous,
            answer
        }).subscribe({
            next: () => {
                this.nextQuestion();
                this.blockInterface = false;
            },
            error: (error) => {
                console.log(error);
                this.blockInterface = false;
                this.errorOccured.emit(error.message);
            }
        });

    }

    skipAnswer() {
        this.blockInterface = true;
        this.onQuestionSkipped({
            questionId: this.questions[this.questionIndex].data.questionId
        }).subscribe({
            next: () => { 
                this.nextQuestion();
                this.blockInterface = false;
            },
            error: (error) => { 
                console.log(error);
                this.blockInterface = false;
                this.errorOccured.emit(error.message);
            }
        });
    }

    /* previousQuestion() {
        if (this.questionIndex > 0) {
            this.questionIndex--;
            this.loadQuestionComponent();
        }
    }

    stepBack() {
        this.previousQuestion();
    } */

}
