

import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, Observable, delay, retry, of } from 'rxjs';
import { TWithId, TObjectId } from '@models/common.model';
import { TQuestionConfirmedAnswer, TQuestionSkipped, ISurvey } from '@models/survey.model';


@Injectable({
    providedIn: 'root'
})
export class SurveyService {


    constructor(private readonly httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError(() => new Error(error.error));
    }

    getQuestions(surveyId: TObjectId<ISurvey>): Observable<TWithId<ISurvey>> {
        return this.httpClient.get<TWithId<ISurvey>>(`/api/surveys/${surveyId}`)
            .pipe(
                //delay(1000), only for test!!!
                catchError(this.handleError));
    }

    confirmAnswer(surveyId: TObjectId<ISurvey>, answer: TQuestionConfirmedAnswer) {
        /* console.log('confirmed');
        return of(true).pipe(delay(2000)); */
        return this.pipeRequest(
            this.httpClient.post(`/api/surveys/${surveyId}/confirmAnswer`, answer, { responseType: 'text'})
        );
    }

    skipQuestion(surveyId: TObjectId<ISurvey>, skipped: TQuestionSkipped) {
       console.log('skipped');
        return this.pipeRequest(
            this.httpClient.post(`/api/surveys/${surveyId}/skipQuestion`, skipped, { responseType: 'text'})
        );
    }

    completeSurvey(surveyId: TObjectId<ISurvey>) {
        console.log('completed');
        return this.pipeRequest(
            this.httpClient.post(`/api/surveys/${surveyId}/complete`, {}, { responseType: 'text'})
        );
    }

    private pipeRequest(request: Observable<any>) {
        return request.pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError))
    }
}
