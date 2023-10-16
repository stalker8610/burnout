import { Component, Input, OnInit } from '@angular/core';
import { ITeammate } from '../data.service';
import { FormControl } from '@angular/forms';
import { debounce, startWith, timer, Subject } from 'rxjs';
import { QuestionComponent } from '../question.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-team-assert-boolean-question-card',
    templateUrl: './team-assert-boolean-question-card.component.html',
    styleUrls: ['./team-assert-boolean-question-card.component.scss']
})
export class TeamAssertBooleanQuestionCardComponent implements QuestionComponent, OnInit {

    @Input() inputData: {
        team: ITeammate[];
    } = {
            team: []
        }

    emptyAnswer = new BehaviorSubject<boolean>(true);

    filter = new FormControl('');
    filteredTeam = new Subject<ITeammate[]>();

    selectionModelArray: Array<SelectionModel<boolean>> = [];

    // selectionModel = new SelectionModel<ITeammate>(true, [],)

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
            this.inputData.team.filter(teammate => teammate.name.match(new RegExp(value, "i")))
        )
    }

    updateEmptyAnswerState() {
        const emptyAnswer = this.selectionModelArray.every(selectionModel => selectionModel.selected.length === 0);
        this.emptyAnswer.next(emptyAnswer);
    }

    confirmAnswer() {
        const result: Record<number, boolean> = {};
        this.selectionModelArray.forEach((selectionModel, index) => {
            if (selectionModel.selected.length) {
                result[this.inputData.team[index].id] = selectionModel.selected[0];
            }
        })
        console.log(result);
        return result;
    }

}
