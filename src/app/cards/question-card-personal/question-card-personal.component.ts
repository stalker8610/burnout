import { EmptyStateEmitable, IQuestionComponent } from '../question.interface';
import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { TeammateFeedbackQuestionInputData } from '../question.interface';
import { PersonalFeedbackMood, TAnswerPersonal } from '@models/survey.model';
import { getPersonalFeedbackView } from 'src/app/store/data/data.util';

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
export class QuestionCardPersonalComponent extends EmptyStateEmitable implements IQuestionComponent, OnInit {

    @Input() inputData!: TeammateFeedbackQuestionInputData;
    newcomer = false;
    selectionModel = new SelectionModel<PersonalFeedbackMood>(false)
    text = '';

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => this.checkEmptyAnswer());
    }

    getState(mood: PersonalFeedbackMood) {
        return this.selectionModel.isSelected(mood) ? 'checked' : 'unchecked'
    }

    isAnswerEmpty(): boolean {
        return !this.selectionModel.selected.length && !this.text.trim().length && !this.newcomer;
    }

    get answer(): TAnswerPersonal {
        let result: TAnswerPersonal;
        if (this.newcomer) {
            result = {
                feedbackTo: this.inputData.teammate._id,
                newcomer: true
            }
        } else {
            result = {
                feedbackTo: this.inputData.teammate._id,
            };

            const text = this.text.trim();
            if (text.length) {
                result.text = text;
            }

            if (this.selectionModel.selected.length) {
                result.mood = this.selectionModel.selected[0];
            }
        }
        return result;
    }

    moods = [
        {
            mood: PersonalFeedbackMood.Angry,
            imgSrc: '/assets/images/team/angry.png',
            label: getPersonalFeedbackView(PersonalFeedbackMood.Angry)
        },
        {
            mood: PersonalFeedbackMood.Sad,
            imgSrc: '/assets/images/team/sad.png',
            label: getPersonalFeedbackView(PersonalFeedbackMood.Sad)
        },
        {
            mood: PersonalFeedbackMood.Happy,
            imgSrc: '/assets/images/team/happy.png',
            label: getPersonalFeedbackView(PersonalFeedbackMood.Happy)
        },
        {
            mood: PersonalFeedbackMood.Happier,
            imgSrc: '/assets/images/team/happy-2.png',
            label: getPersonalFeedbackView(PersonalFeedbackMood.Happier)
        },
        {
            mood: PersonalFeedbackMood.Happiest,
            imgSrc: '/assets/images/team/happy-3.png',
            label: getPersonalFeedbackView(PersonalFeedbackMood.Happiest)
        },
    ]
}
