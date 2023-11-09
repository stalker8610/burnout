

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TWithId, TObjectId } from '@models/common.model';
import { TQuestionConfirmedAnswer, TQuestionSkipped, ISurvey } from '@models/survey.model';
import { AbstractHttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class SurveyService extends AbstractHttpService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    getQuestions(surveyId: TObjectId<ISurvey>): Observable<TWithId<ISurvey>> {
        return this.pipeRequest(this.httpClient.get<TWithId<ISurvey>>(`/api/surveys/${surveyId}`))
        /* .pipe(
            delay(1000), only for test!!!
        ); */
    }

    confirmAnswer(surveyId: TObjectId<ISurvey>, answer: TQuestionConfirmedAnswer) {
        return this.pipeRequest(
            this.httpClient.post(`/api/surveys/${surveyId}/confirmAnswer`, answer, { responseType: 'text' })
        );
    }

    skipQuestion(surveyId: TObjectId<ISurvey>, skipped: TQuestionSkipped) {
        console.log('skipped');
        return this.pipeRequest(
            this.httpClient.post(`/api/surveys/${surveyId}/skipQuestion`, skipped, { responseType: 'text' })
        );
    }

    completeSurvey(surveyId: TObjectId<ISurvey>) {
        console.log('completed');
        return this.pipeRequest(
            this.httpClient.post(`/api/surveys/${surveyId}/complete`, {}, { responseType: 'text' })
        );
    }

}
