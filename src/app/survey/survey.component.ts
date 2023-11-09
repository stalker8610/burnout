import { TObjectId, TWithId } from '@models/common.model';
import { DataService, TTeammate, TTeam } from '../services/data.service';
import { SurveyService } from '../services/survey.service';
import { Component, Input, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { TQuestionConfirmedAnswer, TQuestionSkipped, IQuestion, ISurvey } from '@models/survey.model';


import { QuestionCardWallComponent } from '../cards/question-card-wall/question-card-wall.component';
import { QuestionCardCompanyComponent } from '../cards/question-card-company/question-card-company.component';
import { QuestionCardTeamAssertCheckboxComponent } from '../cards/question-card-team-assert-checkbox/question-card-team-assert-checkbox.component';
import { QuestionCardPersonalComponent } from '../cards/question-card-personal/question-card-personal.component';
import { QuestionCardTeamAssertBooleanComponent } from '../cards/question-card-team-assert-boolean/question-card-team-assert-boolean.component';

interface AbstractQuestionInputData {
    questionId: TObjectId<IQuestion>,
    title: string,
}

export interface WallQuestionInputData extends AbstractQuestionInputData { }

export interface CompanyQuestionInputData extends AbstractQuestionInputData {
    subtitle: string
}

export interface TeammateFeedbackQuestionInputData extends AbstractQuestionInputData {
    teammate: TTeammate
}

export interface TeamAssertBooleanQuestionInputData extends AbstractQuestionInputData {
    team: TTeam
}

export interface TeamAssertCheckboxQuestionInputData extends AbstractQuestionInputData {
    team: TTeam
}

export type QuestionInputData =
    WallQuestionInputData |
    CompanyQuestionInputData |
    TeammateFeedbackQuestionInputData |
    TeamAssertBooleanQuestionInputData |
    TeamAssertCheckboxQuestionInputData

export class QuestionItem {
    constructor(public component: Type<any>, public data: QuestionInputData) { }
}

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

    @Input() surveyId: string = '';
    surveyCompleted = false;

    survey!: TWithId<ISurvey>;
    questions: QuestionItem[] = [];
    errorMessage: string = '';

    constructor(private readonly surveyService: SurveyService,
        private readonly dataService: DataService) { }

    ngOnInit() {
        this.surveyService.getQuestions(this.surveyId)
            .subscribe(value => {
                this.survey = value;
                value.questions.forEach(question => {
                    const questionItem = this.createQuestionItem(question as TWithId<IQuestion>);
                    this.questions.push(questionItem)
                });
            })
    }

    createQuestionItem(question: TWithId<IQuestion>) {

        switch (question.type) {
            case 'wall': return new QuestionItem(QuestionCardWallComponent,
                {
                    questionId: question._id,
                    title: question.title
                });
            case 'personal': return new QuestionItem(QuestionCardPersonalComponent,
                {
                    questionId: question._id,
                    title: question.title,
                    //teammate: this.dataService.getRespondent(this.survey.feedbackToId)
                });
            case 'boolean': return new QuestionItem(QuestionCardTeamAssertBooleanComponent,
                {
                    questionId: question._id,
                    title: question.title,
                    //team: this.dataService.getTeam()
                });
            case 'checkbox': return new QuestionItem(QuestionCardTeamAssertCheckboxComponent,
                {
                    questionId: question._id,
                    title: question.title,
                    subtitle: 'Выберите, кто из коллег, как правило...',
                    //team: this.dataService.getTeam()
                });
            case 'company': return new QuestionItem(QuestionCardCompanyComponent,
                {
                    questionId: question._id,
                    title: question.title,
                    subtitle: 'Насколько вы согласны со следующим утверждением?',
                });
            default: throw 'Unknown question type';
        }
    }

    onAnswerConfirmed(answer: TQuestionConfirmedAnswer) {
        this.errorMessage = '';
        return this.surveyService.confirmAnswer(this.surveyId, answer);
    }

    onQuestionSkipped(skipped: TQuestionSkipped) {
        this.errorMessage = '';
        return this.surveyService.skipQuestion(this.surveyId, skipped);
    }

    onSurveyCompleted($event: any) {
        this.surveyCompleted = true;
        this.surveyService.completeSurvey(this.surveyId)
            .subscribe({
                error: console.log
            });
    }

    onErrorOccured(error: string) {
        this.errorMessage = error;
        console.log('errorOccured', this.errorMessage);
    }
}
