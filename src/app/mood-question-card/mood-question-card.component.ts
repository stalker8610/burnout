import { QuestionComponent } from './../question.interface';
import { Component, Input } from '@angular/core';

enum Mood {
    Sad,
    Neutral,
    Happy
}

@Component({
    selector: 'app-mood-question-card',
    templateUrl: './mood-question-card.component.html',
    styleUrls: ['./mood-question-card.component.scss']
})
export class MoodQuestionCardComponent implements QuestionComponent {

    @Input() inputData: any;

    outputData: {
        mood: Mood | null,
        text: string
    } | null = null;

    public readonly Mood = Mood;
    /* anonymous = false; */
    mood: Mood | null = null;
    text: string = '';


    constructor() { }

    setMood(mood: Mood) {
        this.mood = mood;
    }

    confirmAnswer() {
        return {
            mood: this.mood,
            text: this.text
        }
    }

}
