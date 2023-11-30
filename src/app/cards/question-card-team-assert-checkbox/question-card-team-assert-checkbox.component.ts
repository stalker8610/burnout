import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounce, startWith, timer } from 'rxjs';
import { QuestionComponent } from '../question.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { TeamAssertCheckboxQuestionInputData } from 'src/app/survey/survey.component';
import { TAnswerTeamAssertCheckbox } from '@models/survey.model';
import { getTeamExceptAuthorizedUser } from 'src/app/store/data/data.selectors';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { TTeammate } from '@models/survey.model';


@Component({
    selector: 'app-question-card-team-assert-checkbox',
    templateUrl: './question-card-team-assert-checkbox.component.html',
    styleUrls: ['./question-card-team-assert-checkbox.component.scss']
})
export class QuestionCardTeamAssertCheckboxComponent implements QuestionComponent, OnInit {

    @Input() inputData!: TeamAssertCheckboxQuestionInputData;

    emptyAnswer = new BehaviorSubject<boolean>(true);

    filter = new FormControl('');
    filteredTeam = new BehaviorSubject<TTeammate[]>([]);

    selectionModel = new SelectionModel<TTeammate>(true, [],)

    constructor(private store: Store) { }

    ngOnInit(): void {

        this.filteredTeam.next(this.inputData.team);
        this.filter.valueChanges
            .pipe(
                startWith(''),
                debounce(() => timer(500))
            ).subscribe(value => {
                this.filterTeam(value || '');
            })

        this.selectionModel.changed
            .subscribe(selected => this.updateEmptyAnswerState());

    }

    private filterTeam(value: string) {
        this.filteredTeam.next(
            this.inputData.team.filter(teammate => teammate.fullName.match(new RegExp(value, "i")))
        )
    }

    updateEmptyAnswerState() {
        const emptyAnswer = !this.selectionModel.selected.length;
        this.emptyAnswer.next(emptyAnswer);
    }

    confirmAnswer(): TAnswerTeamAssertCheckbox {
        return this.selectionModel.selected.map(teammate => ({
            respondentId: teammate._id,
            is: true
        }));
    }

}
