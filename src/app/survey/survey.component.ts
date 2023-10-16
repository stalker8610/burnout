import { DataService, ITeammate } from '../data.service';
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
    team: ITeammate[] = [];

    constructor(private readonly surveyService: SurveyService,
        private readonly dataService: DataService) { }

    ngOnInit() {
        this.questions = this.surveyService.getQuestions();
        this.dataService.getTeam().subscribe(value => this.team = value);
    }

    onSurveyCompleted($event: any) {
        this.surveyCompleted = true;
        console.log(`survey completed`);
    }
}
