import { Component, Input, OnInit } from '@angular/core';
import { ITeammate } from '../data.service';
import { FormControl } from '@angular/forms';
import { debounce, startWith, timer, Subject } from 'rxjs';
import { QuestionComponent } from '../question.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-team-assert-question-card',
    templateUrl: './team-assert-question-card.component.html',
    styleUrls: ['./team-assert-question-card.component.scss']
})
export class TeamAssertQuestionCardComponent implements QuestionComponent, OnInit {

    @Input() inputData: {
        team: ITeammate[];
    } = {
            team: []
        }

    emptyAnswer = new BehaviorSubject<boolean>(true);

    filter = new FormControl('');
    filteredTeam = new Subject<ITeammate[]>();

    selectionModel = new SelectionModel<ITeammate>(true, [],)

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
            this.inputData.team.filter(teammate => teammate.name.match(new RegExp(value, "i")))
        )
    }

    updateEmptyAnswerState() {
        const emptyAnswer = !this.selectionModel.selected.length;
        this.emptyAnswer.next(emptyAnswer);
    }

    confirmAnswer() {
        return null;
    }

}
