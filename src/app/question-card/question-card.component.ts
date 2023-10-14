import { Component, Input, ViewChild, ComponentRef, Output, EventEmitter } from '@angular/core';
import { QuestionDirective } from '../question.directive';
import { QuestionComponent } from '../question.interface';
import { QuestionItem } from '../survey.service';

@Component({
    selector: 'app-question-card',
    templateUrl: './question-card.component.html',
    styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent {

    @Input() questions: QuestionItem[] = [];
    @Output() surveyCompleted = new EventEmitter();

    questionIndex: number = -1;
    caption = '';

    private componentRef!: ComponentRef<QuestionComponent>;

    @ViewChild(QuestionDirective, { static: true }) questionHost!: QuestionDirective;

    anonymous = false;

    ngOnInit(): void {
        this.loadQuestionComponent();
    }

    loadQuestionComponent() {
        this.questionIndex++;
        const questionItem = this.questions[this.questionIndex];

        const viewContainerRef = this.questionHost.viewContainerRef;
        viewContainerRef.clear();

        this.componentRef = viewContainerRef.createComponent<QuestionComponent>(questionItem.component);
        this.componentRef.instance.inputData = questionItem.data;
        if ('caption' in questionItem.data) {
            this.caption = questionItem.data.caption;
        }
    }

    confirmAnswer() {
        console.log(this.componentRef.instance.confirmAnswer());
        this.nextQuestion();
    }

    nextQuestion(){
        if (this.questionIndex !== this.questions.length - 1) {
            this.loadQuestionComponent();
        } else {
            this.surveyCompleted.emit();
        }
    }

    skipAnswer() {
        console.log('answer skipped');
        this.nextQuestion();
    }

}
