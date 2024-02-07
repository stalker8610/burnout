import { TObjectId } from '@models/common.model';
import { Component, Input, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { IQuestion } from '@models/survey.model';
import { Store } from '@ngrx/store';
import { loadRequested } from '../store/survey/survey.actions';
import { filter, map } from 'rxjs';
import { TTeammate } from '@models/survey.model';

import { getAuthorizedUser } from '../store/auth/auth.selectors';
import { getLoaded, getSurvey } from '../store/survey/survey.selectors';
import { DataActions } from '../store/data/data.actions';

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
    team: TTeammate[]
}

export interface TeamAssertCheckboxQuestionInputData extends AbstractQuestionInputData {
    team: TTeammate[]
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

    loaded = this.store.select(getLoaded);
    survey = this.store.select(getSurvey);
    surveyCompleted = this.survey.pipe(
        map(survey => !!survey?.finishedAt)
    )

    constructor(private store: Store) { }

    ngOnInit() {

        this.store.dispatch(DataActions.loadRequested());

        if (!this.surveyId) {
            this.store.select(getAuthorizedUser)
                .pipe(
                    filter(user => !!user),
                )
                .subscribe(
                    user => this.store.dispatch(loadRequested({ respondentId: user!.respondentId }))
                )
        } else {
            this.store.dispatch(loadRequested({ surveyId: this.surveyId }))
        }

    }

}
