import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmptyStateEmitable, IQuestionComponent } from '../question.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { TeamAssertCheckboxQuestionInputData } from '../question.interface';
import { TAnswerTeamAssertCheckbox } from '@models/survey.model';
import { TTeammate } from '@models/survey.model';

@Component({
    selector: 'app-question-card-team-assert-checkbox',
    templateUrl: './question-card-team-assert-checkbox.component.html',
    styleUrls: ['./question-card-team-assert-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionCardTeamAssertCheckboxComponent extends EmptyStateEmitable implements IQuestionComponent, OnInit {

    @Input() inputData!: TeamAssertCheckboxQuestionInputData;
    
    filter = new FormControl('', { nonNullable: true });
    filteredTeam: ReadonlyArray<TTeammate> = [];
    selectionModel = new SelectionModel<TTeammate>(true, [],)

    ngOnInit(): void {
        this.filteredTeam = this.inputData.team;
        this.filter.valueChanges
            .subscribe(value => this.filterTeam(value))
        this.selectionModel.changed
            .subscribe(() => this.checkEmptyAnswer());
    }

    private filterTeam(value: string) {
        this.filteredTeam = !value
            ? this.inputData.team
            : this.inputData.team.filter(teammate => teammate.fullName.match(new RegExp(value, "i")))
    }

    isAnswerEmpty(): boolean {
        return !this.selectionModel.selected.length;
    }

    get answer(): TAnswerTeamAssertCheckbox {
        return this.selectionModel.selected.map(teammate => ({
            respondentId: teammate._id,
            is: true
        }));
    }

}
