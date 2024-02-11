import { isNotNull } from 'src/app/store/util';
import { NgIf, NgComponentOutlet } from '@angular/common';
import { Component, Input, Output, ComponentRef, ViewChild, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import type { TAnswer } from '@models/survey.model';
import { IQuestionComponent, TQuestionInputData } from '../question.interface';
import { QuestionDirective } from '../question.directive';
import { Type } from '@angular/core';

@Component({
    selector: 'app-question-card-layout',
    templateUrl: './question-card-layout.component.html',
    styleUrls: ['./question-card-layout.component.scss'],
    imports: [MatCheckboxModule, MatButtonModule, NgIf, NgComponentOutlet, FormsModule, QuestionDirective],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionCardLayoutComponent implements OnChanges {

    @Input() title = '';
    @Input() subtitle = '';
    @Input() currentQuestionIndex = 0;
    @Input() questionsAmount = 0;
    @Input() blockInterface = false;
    @Input() componentType: Type<IQuestionComponent> | null = null;
    @Input() questionData: TQuestionInputData | null = null;

    @Output() skipEvent = new EventEmitter<void>();
    @Output() confirmEvent = new EventEmitter<{ answer: TAnswer, anonymous: boolean }>();

    anonymous = false;
    emptyAnswer = true;

    private componentRef: ComponentRef<IQuestionComponent> | null = null;

    @ViewChild(QuestionDirective, { static: true }) questionHost!: QuestionDirective;

    ngOnChanges(changes: SimpleChanges) {
        //check if next question got
        if ('currentQuestionIndex' in changes) {

            if (!isNotNull(this.componentType)) {
                throw new Error('No component type provided');
            }

            if (!isNotNull(this.questionData)) {
                throw new Error('No input question data provided');
            }

            const viewContainerRef = this.questionHost.viewContainerRef;
            viewContainerRef.clear();
            this.anonymous = false;
            this.componentRef = viewContainerRef.createComponent(this.componentType);
            this.componentRef.instance.inputData = this.questionData;
            this.componentRef.instance.emptyStateChanged.
                subscribe(value => this.emptyAnswer = value as boolean);
        }
    }

    skipAnswer() {
        this.skipEvent.emit();
    }

    confirmAnswer() {
        if (this.componentRef) {
            this.confirmEvent.emit({
                answer: this.componentRef.instance.answer,
                anonymous: this.anonymous
            });
        }
    }

}
