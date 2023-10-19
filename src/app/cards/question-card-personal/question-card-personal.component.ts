import { QuestionComponent } from '../question.interface';
import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { TeammateFeedbackQuestionInputData } from 'src/app/survey/survey.component';
import { PersonalFeedbackMood, TAnswerPersonal } from '@models/survey.model';

@Component({
    selector: 'app-question-card-personal',
    templateUrl: './question-card-personal.component.html',
    styleUrls: ['./question-card-personal.component.scss'],
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
export class QuestionCardPersonalComponent implements QuestionComponent, OnInit {

    @Input() inputData!: TeammateFeedbackQuestionInputData;

    emptyAnswer = new BehaviorSubject<boolean>(true);
    newcomer = false;

    moods = [
        {
            mood: PersonalFeedbackMood.Angry,
            imgSrc: '/assets/images/team/angry.png',
            label: 'Сильно не соответствует ожиданиям'
        },
        {
            mood: PersonalFeedbackMood.Sad,
            imgSrc: '/assets/images/team/sad.png',
            label: 'Не соответствует ожиданиям'
        },
        {
            mood: PersonalFeedbackMood.Happy,
            imgSrc: '/assets/images/team/happy.png',
            label: 'Соответствует ожиданиям'
        },
        {
            mood: PersonalFeedbackMood.Happier,
            imgSrc: '/assets/images/team/happy-2.png',
            label: 'Превосходит ожидания'
        },
        {
            mood: PersonalFeedbackMood.Happiest,
            imgSrc: '/assets/images/team/happy-3.png',
            label: 'Сильно превосходит ожидания'
        },
    ]

    selectionModel = new SelectionModel<PersonalFeedbackMood>(false)

    text = '';

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => {
            this.updateEmptyAnswerState();
        })
    }

    getState(mood: PersonalFeedbackMood) {
        return this.selectionModel.isSelected(mood) ? 'checked' : 'unchecked'
    }

    confirmAnswer(): TAnswerPersonal {

        let result: TAnswerPersonal;
        if (this.newcomer) {
            result = {
                newcomer: true
            }
        } else {
            result = {};
            if (this.text.trim().length) {
                result.text = this.text.trim();
            }

            if (this.selectionModel.selected.length) {
                result.mood = this.selectionModel.selected[0];
            }
        }
        return result;
    }

    updateEmptyAnswerState() {
        const emptyAnswer = !this.selectionModel.selected.length && !this.text.trim().length && !this.newcomer;
        this.emptyAnswer.next(emptyAnswer);
    }

}
