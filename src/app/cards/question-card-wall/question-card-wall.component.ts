import { QuestionComponent } from '../question.interface';
import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { WallQuestionInputData } from 'src/app/survey/survey.component';
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
export class QuestionCardWallComponent implements QuestionComponent, OnInit {

    @Input() inputData!: WallQuestionInputData;
    emptyAnswer = new BehaviorSubject<boolean>(true);
    text: string = '';

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

    selectionModel = new SelectionModel<SelfMood>(false);

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => {
            this.updateEmptyAnswerState();
        })
    }

    updateEmptyAnswerState() {
        const emptyAnswer = !this.selectionModel.selected.length && !this.text.trim().length;
        this.emptyAnswer.next(emptyAnswer);
    }

    getState(mood: SelfMood) {
        return this.selectionModel.isSelected(mood) ? 'checked' : 'unchecked'
    }

    confirmAnswer(): TAnswerWall {
        
        const result: TAnswerWall = {};
        if (this.text.trim().length){
            result.text = this.text.trim();
        }

        if (this.selectionModel.selected.length){
            result.mood = this.selectionModel.selected[0];
        }
        
        return result;
    }



}
