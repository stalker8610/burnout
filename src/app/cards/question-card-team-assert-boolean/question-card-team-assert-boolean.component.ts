import { Component, Input, OnInit } from '@angular/core';
import { TTeammate } from '../../services/data.service';
import { FormControl } from '@angular/forms';
import { debounce, startWith, timer, Subject } from 'rxjs';
import { QuestionComponent } from '../question.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { TeamAssertBooleanQuestionInputData } from 'src/app/survey/survey.component';
import { TAnswerTeamAssertBoolean } from '@models/survey.model';

@Component({
    selector: 'app-question-card-team-assert-boolean',
    templateUrl: './question-card-team-assert-boolean.component.html',
    styleUrls: ['./question-card-team-assert-boolean.component.scss']
})
export class QuestionCardTeamAssertBooleanComponent implements QuestionComponent, OnInit {

    @Input() inputData!: TeamAssertBooleanQuestionInputData;

    emptyAnswer = new BehaviorSubject<boolean>(true);

    filter = new FormControl('');
    filteredTeam = new BehaviorSubject<TTeammate[]>([]);

    selectionModelArray: Array<SelectionModel<boolean>> = [];

    ngOnInit(): void {

        this.selectionModelArray = this.inputData.team.map(teammate => new SelectionModel<boolean>(false))

        this.filteredTeam.next(this.inputData.team);
        this.filter.valueChanges
            .pipe(
                startWith(''),
                debounce(() => timer(500))
            ).subscribe(value => {
                this.filterTeam(value || '');
            })

        this.selectionModelArray.forEach(selectionModel =>
            selectionModel.changed
                .subscribe(() => this.updateEmptyAnswerState()));

    }

    private filterTeam(value: string) {
        this.filteredTeam.next(
            this.inputData.team.filter(teammate => teammate.fullName.match(new RegExp(value, "i")))
        )
    }

    updateEmptyAnswerState() {
        const emptyAnswer = this.selectionModelArray.every(selectionModel => selectionModel.selected.length === 0);
        this.emptyAnswer.next(emptyAnswer);
    }

    confirmAnswer(): TAnswerTeamAssertBoolean {
        const result: TAnswerTeamAssertBoolean = {};
        this.selectionModelArray.forEach((selectionModel, index) => {
            if (selectionModel.selected.length) {
                result[this.inputData.team[index]._id] = selectionModel.selected[0];
            }
        })
        return result;
    }

}
