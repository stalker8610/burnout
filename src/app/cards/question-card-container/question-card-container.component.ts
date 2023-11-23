import { Component, Input, ViewChild, ComponentRef, OnInit } from '@angular/core';
import { QuestionDirective } from '../question.directive';
import { QuestionComponent } from '../question.interface';

import { distinctUntilChanged, map, filter, delay } from 'rxjs';
import { QuestionItem } from '../../survey/survey.component';
import { TObjectId, TWithId } from '@models/common.model';
import { EOperationStatus, IQuestion, TQuestionConfirmedAnswer } from '@models/survey.model';
import { ISurvey } from '@models/survey.model';
import { Store } from '@ngrx/store';
import { nextQuestionRequested, answerConfirmed, questionSkipped } from 'src/app/store/survey/survey.actions';
import { getCurrentQuestion, getCurrentQuestionIndex, getOperationStatus } from 'src/app/store/survey/survey.selectors';
import { getTeamExceptAuthorizedUser, getTeammateForFeedback } from 'src/app/store/data/data.selectors';
import { TTeammate } from '@models/survey.model';


import { QuestionCardWallComponent } from '../question-card-wall/question-card-wall.component';
import { QuestionCardCompanyComponent } from '../question-card-company/question-card-company.component';
import { QuestionCardTeamAssertCheckboxComponent } from '../question-card-team-assert-checkbox/question-card-team-assert-checkbox.component';
import { QuestionCardPersonalComponent } from '../question-card-personal/question-card-personal.component';
import { QuestionCardTeamAssertBooleanComponent } from '../question-card-team-assert-boolean/question-card-team-assert-boolean.component';
import { IRespondent } from '@models/respondent.model';
import { concatLatestFrom } from '@ngrx/effects';



@Component({
    selector: 'app-question-card-container',
    templateUrl: './question-card-container.component.html',
    styleUrls: ['./question-card-container.component.scss']
})
export class QuestionCardContainerComponent implements OnInit {

    @Input() surveyId: TObjectId<ISurvey> = '';
    @Input() feedbackToId: TObjectId<IRespondent> = '';
    @Input() questionsAmount: number = 0;

    title = '';
    subtitle = '';

    private componentRef!: ComponentRef<QuestionComponent>;

    @ViewChild(QuestionDirective, { static: true }) questionHost!: QuestionDirective;

    anonymous = false;
    emptyAnswer = true;

    blockInterface = this.store.select(getOperationStatus).pipe(
        map(status => status === EOperationStatus.Pending)
    );
    currentQuestionIndex = this.store.select(getCurrentQuestionIndex);
    currentQuestionId: TObjectId<IQuestion> | null = null;

    constructor(private store: Store) { }

    ngOnInit(): void {

        this.store.select(getCurrentQuestion)
            .pipe(
                filter(question => !!question),
                concatLatestFrom(() => [
                    this.store.select(getTeamExceptAuthorizedUser),
                    this.store.select(getTeammateForFeedback(this.feedbackToId))
                ]),
                filter(([question, team, teammate]) => !!team && team.every(teammate => !!teammate.department) && !!teammate),
            )

            .subscribe(([question, team, teammate]) => {
                this.currentQuestionId = question!._id;

                //clear checkbox
                this.anonymous = false;

                const questionItem = this.getQuestionData(question!, team as TTeammate[], teammate as TTeammate);
                const viewContainerRef = this.questionHost.viewContainerRef;
                viewContainerRef.clear();

                this.componentRef = viewContainerRef.createComponent<QuestionComponent>(questionItem.component);
                this.componentRef.instance.inputData = questionItem.data;
                this.componentRef.instance.emptyAnswer?.pipe(distinctUntilChanged()).
                    subscribe(value => this.emptyAnswer = value);

                this.title = questionItem.data.title ?? '';
                this.subtitle = 'subtitle' in questionItem.data ? questionItem.data.subtitle : '';
            })

        /* this.store.select(getCurrentQuestionIndex)
            .subscribe(
                index => {
                    if (index === -1) {
                        this.store.dispatch(nextQuestionRequested());
                    }
                }
            ) */
    }

    getQuestionData(question: TWithId<IQuestion>, team: TTeammate[], teammate: TTeammate) {

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
                    teammate
                });
            case 'boolean': return new QuestionItem(QuestionCardTeamAssertBooleanComponent,
                {
                    questionId: question._id,
                    title: question.title,
                    team
                });
            case 'checkbox': return new QuestionItem(QuestionCardTeamAssertCheckboxComponent,
                {
                    questionId: question._id,
                    title: question.title,
                    subtitle: 'Выберите, кто из коллег, как правило...',
                    team
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

    confirmAnswer() {
        const answer = this.componentRef.instance.confirmAnswer();
        const confirmedAnswer: TQuestionConfirmedAnswer = {
            questionId: this.currentQuestionId!,
            answer
        }

        if (this.anonymous) {
            confirmedAnswer.anonymous = true;
        }

        this.store.dispatch(answerConfirmed({ surveyId: this.surveyId, answer: confirmedAnswer }))

    }

    skipAnswer() {
        const skipped = {
            questionId: this.currentQuestionId!
        }
        this.store.dispatch(questionSkipped({ surveyId: this.surveyId, skipped }))
    }

}
