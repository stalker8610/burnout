import { Component, Input, ViewChild, ComponentRef, Output, EventEmitter } from '@angular/core';
import { QuestionDirective } from '../question.directive';
import { QuestionComponent } from '../question.interface';
import { QuestionItem } from '../survey.service';

import { ITeammate } from '../data.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-question-card',
    templateUrl: './question-card.component.html',
    styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent {

    @Input() team: ITeammate[] = []
    @Input() questions: QuestionItem[] = [];
    @Output() surveyCompleted = new EventEmitter();

    questionIndex: number = 0;
    title = '';
    subtitle = '';

    private componentRef!: ComponentRef<QuestionComponent>;

    @ViewChild(QuestionDirective, { static: true }) questionHost!: QuestionDirective;

    anonymous = false;
    emptyAnswer = true;

    ngOnInit(): void {
        this.loadQuestionComponent();
    }

    loadQuestionComponent() {

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

    confirmAnswer() {
        console.log(this.componentRef.instance.confirmAnswer());
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.questionIndex !== this.questions.length - 1) {
            this.questionIndex++;
            this.loadQuestionComponent();
        } else {
            this.surveyCompleted.emit();
        }
    }

    skipAnswer() {
        console.log('answer skipped');
        this.nextQuestion();
    }

    previousQuestion() {
        if (this.questionIndex > 0) {
            this.questionIndex--;
            this.loadQuestionComponent();
        }
    }

    stepBack() {
        this.previousQuestion();
    }

}
