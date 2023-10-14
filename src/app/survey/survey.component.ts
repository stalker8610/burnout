import { QuestionItem, SurveyService } from '../survey.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

    surveyCompleted = false;

    questions: QuestionItem[] = [];

    constructor(private readonly surveyService: SurveyService) { }

    ngOnInit() {
        this.questions = this.surveyService.getQuestions();
    }

    onSurveyCompleted($event: any){
        this.surveyCompleted = true;
        console.log(`survey completed`);
    }
}
