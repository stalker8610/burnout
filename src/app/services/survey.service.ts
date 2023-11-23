import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TWithId, TObjectId } from '@models/common.model';
import { TQuestionConfirmedAnswer, TQuestionSkipped, ISurvey } from '@models/survey.model';
import { IRespondent } from '@models/respondent.model';

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    constructor(private httpClient: HttpClient) { }

    getLastSurveyForRespondent(respondentId: TObjectId<IRespondent>) {
        return this.httpClient.get<TWithId<ISurvey> | null>(`/api/surveys/respondent/${respondentId}`)
    }

    getSurveyById(surveyId: TObjectId<ISurvey>): Observable<TWithId<ISurvey>> {
        return this.httpClient.get<TWithId<ISurvey>>(`/api/surveys/${surveyId}`)
    }

    confirmAnswer(surveyId: TObjectId<ISurvey>, answer: TQuestionConfirmedAnswer) {
        return this.httpClient.post(`/api/surveys/${surveyId}/confirmAnswer`, answer, { responseType: 'text' })
    }

    skipQuestion(surveyId: TObjectId<ISurvey>, skipped: TQuestionSkipped) {
        return this.httpClient.post(`/api/surveys/${surveyId}/skipQuestion`, skipped, { responseType: 'text' })
    }

    completeSurvey(surveyId: TObjectId<ISurvey>) {
        return this.httpClient.post<TWithId<ISurvey>>(`/api/surveys/${surveyId}/complete`, {})
    }

}
