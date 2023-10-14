import { Injectable } from '@angular/core';
import { Type } from '@angular/core';
import { MoodQuestionCardComponent } from './mood-question-card/mood-question-card.component';
import { AssertionQuestionCardComponent } from './assertion-question-card/assertion-question-card.component';

export class QuestionItem {
  constructor(public component: Type<any>, public data: any) {}
}

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    getQuestions() {
        return [
            new QuestionItem(
                MoodQuestionCardComponent,
                { caption: 'Поделитесь с коллегами, чем вы занимались, как проводится работа?' }
            ),
            new QuestionItem(
                AssertionQuestionCardComponent,
                {  }
            )
        ];
    }
}
