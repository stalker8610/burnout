import { QuestionComponent } from './../question.interface';
import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';

enum Mood {
    Sad,
    Neutral,
    Happy
}

@Component({
    selector: 'app-mood-question-card',
    templateUrl: './mood-question-card.component.html',
    styleUrls: ['./mood-question-card.component.scss'],
    animations: [
        trigger('checked', [
            state('checked', style({
                opacity: 1
            })),
            state('unchecked', style({
                opacity: 0.5
            })),
            transition('checked => unchecked', [
                animate('0.15s')
            ]),
            transition('unchecked => checked', [
                animate('0.15s')
            ]),
        ]),
    ]
})
export class MoodQuestionCardComponent implements QuestionComponent, OnInit {

    @Input() inputData: any;
    emptyAnswer = new BehaviorSubject<boolean>(true);
    text: string = '';

    moods = [
        {
            mood: Mood.Sad,
            imgSrc: '/assets/images/wall/sad-mood.png'
        },
        {
            mood: Mood.Neutral,
            imgSrc: '/assets/images/wall/neutral-mood.png'
        },
        {
            mood: Mood.Happy,
            imgSrc: '/assets/images/wall/happy-mood.png'
        },
    ]

    selectionModel = new SelectionModel(false);

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => {
            this.updateEmptyAnswerState();
        })
    }

    updateEmptyAnswerState() {
        const emptyAnswer = !this.selectionModel.selected.length && !this.text.trim().length;
        this.emptyAnswer.next(emptyAnswer);
    }

    getState(mood: Mood) {
        return this.selectionModel.isSelected(mood) ? 'checked' : 'unchecked'
    }

    confirmAnswer() {
        return {
            mood: this.selectionModel.selected.length && this.selectionModel.selected[0] || null,
            text: this.text
        }
    }



}
