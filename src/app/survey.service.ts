import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Type } from '@angular/core';
import { MoodQuestionCardComponent } from './mood-question-card/mood-question-card.component';
import { AssertionQuestionCardComponent } from './assertion-question-card/assertion-question-card.component';
import { TeamAssertQuestionCardComponent } from './team-assert-question-card/team-assert-question-card.component';
import { TeammateQuestionCardComponent } from './teammate-question-card/teammate-question-card.component';
import { TeamAssertBooleanQuestionCardComponent } from './team-assert-boolean-question-card/team-assert-boolean-question-card.component';

export class QuestionItem {
    constructor(public component: Type<any>, public data: any) { }
}

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    private team: any;
    constructor(private readonly dataService: DataService) {
        this.dataService.getTeam().subscribe(value => this.team = value);
    }

    getQuestions() {
        return [
            new QuestionItem(
                TeamAssertQuestionCardComponent,
                {
                    title: 'Кто обычно готов пойти на риск?',
                    team: this.team
                }
            ), 
            new QuestionItem(
                TeamAssertBooleanQuestionCardComponent,
                {
                    title: 'Кто обычно готов пойти на риск?',
                    team: this.team
                }
            ),
            
            new QuestionItem(
                MoodQuestionCardComponent,
                { title: 'Поделитесь с коллегами, чем вы занимались, как проводится работа?' }
            ),
            new QuestionItem(
                AssertionQuestionCardComponent,
                {
                    title: 'Я бы порекомендовал продукты и услуги нашей компании своим близким и знакомым',
                    subtitle: 'Насколько вы согласны со следующим утверждением?'
                }
            ),
            new QuestionItem(
                TeammateQuestionCardComponent,
                {
                    title: 'Дайте коллеге обратную связь по его/ее работе за последние несколько недель',
                    teammate: {
                        name: 'Костин Вадим',
                        department: 'Отдел внедрения'
                    }
                }
            ),



        ];
    }
}
