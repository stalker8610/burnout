import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmptyStateEmitable, IQuestionComponent } from '../question.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { TeamAssertBooleanQuestionInputData } from '../question.interface';
import { TAnswerTeamAssertBoolean } from '@models/survey.model';
import { TTeammate } from '@models/survey.model';

@Component({
    selector: 'app-question-card-team-assert-boolean',
    templateUrl: './question-card-team-assert-boolean.component.html',
    styleUrls: ['./question-card-team-assert-boolean.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionCardTeamAssertBooleanComponent extends EmptyStateEmitable implements IQuestionComponent, OnInit {

    @Input() inputData!: TeamAssertBooleanQuestionInputData;

    filter = new FormControl('', { nonNullable: true });
    filteredTeam: ReadonlyArray<TTeammate> = [];

    selectionModelArray: Array<SelectionModel<boolean>> = [];

    ngOnInit(): void {

        this.selectionModelArray = this.inputData.team.map(() => new SelectionModel<boolean>(false))
        this.filteredTeam = this.inputData.team;
        this.filter.valueChanges
            .subscribe(value => this.filterTeam(value))

        this.selectionModelArray.forEach(selectionModel =>
            selectionModel.changed
                .subscribe(() => this.checkEmptyAnswer()));

    }

    private filterTeam(value: string) {
        this.filteredTeam = !value
            ? this.inputData.team
            : this.inputData.team.filter(teammate => teammate.fullName.match(new RegExp(value, "i")))
    }

    override isAnswerEmpty(): boolean {
        return this.selectionModelArray.every(selectionModel => selectionModel.selected.length === 0);
    }

    get answer(): TAnswerTeamAssertBoolean {
        const result: TAnswerTeamAssertBoolean = [];
        this.selectionModelArray.forEach((selectionModel, index) => {
            if (selectionModel.selected.length) {
                result.push({
                    respondentId: this.inputData.team[index]._id,
                    is: selectionModel.selected[0]
                })
            }
        })
        return result;
    }

}
