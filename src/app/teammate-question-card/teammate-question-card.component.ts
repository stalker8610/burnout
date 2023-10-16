import { QuestionComponent } from './../question.interface';
import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';

enum Mood {
    Angry,
    Sad,
    Happy,
    Happier,
    Happiest
}

interface InputData {
    teammate: {
        name: string,
        department: string
    }
}

@Component({
    selector: 'app-teammate-question-card',
    templateUrl: './teammate-question-card.component.html',
    styleUrls: ['./teammate-question-card.component.scss'],
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
export class TeammateQuestionCardComponent implements QuestionComponent, OnInit {

    @Input() inputData: InputData = {
        teammate: {
            name: '',
            department: ''
        }
    };

    emptyAnswer = new BehaviorSubject<boolean>(true);
    newcomer = false;

    moods = [
        {
            mood: Mood.Angry,
            imgSrc: '/assets/images/team/angry.png',
            label: 'Сильно не соответствует ожиданиям'
        },
        {
            mood: Mood.Sad,
            imgSrc: '/assets/images/team/sad.png',
            label: 'Не соответствует ожиданиям'
        },
        {
            mood: Mood.Happy,
            imgSrc: '/assets/images/team/happy.png',
            label: 'Соответствует ожиданиям'
        },
        {
            mood: Mood.Happier,
            imgSrc: '/assets/images/team/happy-2.png',
            label: 'Превосходит ожидания'
        },
        {
            mood: Mood.Happiest,
            imgSrc: '/assets/images/team/happy-3.png',
            label: 'Сильно превосходит ожидания'
        },
    ]

    selectionModel = new SelectionModel(false)

    text = '';

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => {
            this.updateEmptyAnswerState();
        })
    }

    getState(mood: Mood) {
        return this.selectionModel.isSelected(mood) ? 'checked' : 'unchecked'
    }

    confirmAnswer() {
        return {
            mood: this.selectionModel.selected[0],
            text: this.text
        }
    }

    updateEmptyAnswerState() {
        const emptyAnswer = !this.selectionModel.selected.length && !this.text.trim().length && !this.newcomer;
        this.emptyAnswer.next(emptyAnswer);
    }

}
