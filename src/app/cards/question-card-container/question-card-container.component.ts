import { Component, Input, OnInit, Type } from '@angular/core';

import { map, filter, combineLatest } from 'rxjs';
import { TObjectId } from '@models/common.model';
import { EOperationStatus, IQuestion, TQuestionConfirmedAnswer } from '@models/survey.model';
import { ISurvey } from '@models/survey.model';
import { Store } from '@ngrx/store';
import { SurveyActions } from 'src/app/store/survey/survey.actions';
import { getCurrentQuestion, getCurrentQuestionIndex, getOperationStatus } from 'src/app/store/survey/survey.selectors';
import { getTeamExceptAuthorizedUser, getTeammateForFeedback } from 'src/app/store/data/data.selectors';
import { TTeammate } from '@models/survey.model';


import { QuestionCardWallComponent } from '../question-card-wall/question-card-wall.component';
import { QuestionCardCompanyComponent } from '../question-card-company/question-card-company.component';
import { QuestionCardTeamAssertCheckboxComponent } from '../question-card-team-assert-checkbox/question-card-team-assert-checkbox.component';
import { QuestionCardPersonalComponent } from '../question-card-personal/question-card-personal.component';
import { QuestionCardTeamAssertBooleanComponent } from '../question-card-team-assert-boolean/question-card-team-assert-boolean.component';
import { IRespondent } from '@models/respondent.model';
import type { TAnswer } from '@models/survey.model';
import { TQuestionInputData } from '../question.interface';
import { EQuestionType } from '@models/survey.model';
import { isNotNull } from 'src/app/store/util';

type CardComponentType = QuestionCardWallComponent
    | QuestionCardCompanyComponent
    | QuestionCardTeamAssertCheckboxComponent
    | QuestionCardPersonalComponent
    | QuestionCardTeamAssertBooleanComponent


@Component({
    selector: 'app-question-card-container',
    templateUrl: './question-card-container.component.html',
    styleUrls: ['./question-card-container.component.scss'],

})
export class QuestionCardContainerComponent implements OnInit {

    @Input() surveyId: TObjectId<ISurvey> = '';
    @Input() feedbackToId: TObjectId<IRespondent> = '';
    @Input() questionsAmount: number = 0;

    title = '';
    subtitle = '';

    blockInterface = this.store.select(getOperationStatus).pipe(
        map(status => status === EOperationStatus.Pending)
    );
    currentQuestionIndex = this.store.select(getCurrentQuestionIndex);
    currentQuestionId: TObjectId<IQuestion> | null = null;
    questionCardComponentType: Type<CardComponentType> | null = null;
    questionData: TQuestionInputData | null = null;

    constructor(private store: Store) { }

    ngOnInit(): void {

        combineLatest([
            this.store.select(getCurrentQuestion).pipe(filter(isNotNull)),
            this.store.select(getTeamExceptAuthorizedUser),
            this.store.select(getTeammateForFeedback(this.feedbackToId))]).pipe(filter(isNotNull))
            .subscribe(([question, team, teammate]) => {
                this.currentQuestionId = question._id;
                this.title = this.getQuestionTitle(question); 
                this.subtitle = this.getQuestionSubtitle(question); 
                this.questionCardComponentType = this.getQuestionCardComponent(question);
                this.questionData = this.getQuestionInputData(question!, team as TTeammate[], teammate as TTeammate);
            })
    }

    private getQuestionCardComponent(question: IQuestion) {
        switch (question.type) {
            case EQuestionType.Wall: return QuestionCardWallComponent;
            case EQuestionType.Pesronal: return QuestionCardPersonalComponent;
            case EQuestionType.Boolean: return QuestionCardTeamAssertBooleanComponent;
            case EQuestionType.Checkbox: return QuestionCardTeamAssertCheckboxComponent;
            case EQuestionType.Company: return QuestionCardCompanyComponent;
            default: throw 'Unknown question type';
        }
    }

    private getQuestionTitle(question: IQuestion) {
        return question.title;
    }

    private getQuestionSubtitle(question: IQuestion): string { 
        switch (question.type) {
            case EQuestionType.Checkbox: return 'Выберите, кто из коллег, как правило...';
            case EQuestionType.Company: return 'Насколько вы согласны со следующим утверждением?';
            default: return '';
        }
    }

    private getQuestionInputData(question: IQuestion, team: TTeammate[], teammate: TTeammate): TQuestionInputData { 
        switch (question.type) {
            case EQuestionType.Pesronal: return { teammate };
            case EQuestionType.Boolean: return { team };
            case EQuestionType.Checkbox: return { team };
            default: return {};
        }
    }

    onConfirm({ answer, anonymous }: { answer: TAnswer, anonymous: boolean }) {
        const confirmedAnswer: TQuestionConfirmedAnswer = {
            questionId: this.currentQuestionId!,
            answer
        }
        if (anonymous) {
            confirmedAnswer.anonymous = true;
        }
        this.store.dispatch(SurveyActions.answerConfirmed({ surveyId: this.surveyId, answer: confirmedAnswer }))
    }

    onSkip() {
        const skipped = { questionId: this.currentQuestionId! }
        this.store.dispatch(SurveyActions.questionSkipped({ surveyId: this.surveyId, skipped }))
    }

}
