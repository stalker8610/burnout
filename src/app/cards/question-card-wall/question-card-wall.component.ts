import { EmptyStateEmitable } from './../question.interface';
import { IQuestionComponent } from '../question.interface';
import { Component, Input, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { WallQuestionInputData } from '../question.interface';
import { TAnswerWall, SelfMood } from '@models/survey.model';

@Component({
    selector: 'app-question-card-wall',
    templateUrl: './question-card-wall.component.html',
    styleUrls: ['./question-card-wall.component.scss'],
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
export class QuestionCardWallComponent extends EmptyStateEmitable implements IQuestionComponent, OnInit {

    @Input() inputData!: WallQuestionInputData;
    text: string = '';
    selectionModel = new SelectionModel<SelfMood>(false);

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => this.checkEmptyAnswer())
    }

    isAnswerEmpty(): boolean {
        return !this.selectionModel.selected.length && !this.text.trim().length;
    }

    getState(mood: SelfMood) {
        return this.selectionModel.isSelected(mood) ? 'checked' : 'unchecked'
    }

    get answer(): TAnswerWall {
        const result: TAnswerWall = {};
        const text = this.text.trim();
        if (text.length){
            result.text = text;
        }
        if (this.selectionModel.selected.length){
            result.mood = this.selectionModel.selected[0];
        }
        return result;
    }

    moods = [
        {
            mood: SelfMood.Sad,
            imgSrc: '/assets/images/wall/sad-mood.png'
        },
        {
            mood: SelfMood.Neutral,
            imgSrc: '/assets/images/wall/neutral-mood.png'
        },
        {
            mood: SelfMood.Happy,
            imgSrc: '/assets/images/wall/happy-mood.png'
        },
    ]

}
