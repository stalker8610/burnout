import type { TTeammate } from '@models/survey.model';
import { BehaviorSubject } from 'rxjs';
import { TAnswer } from '@models/survey.model';

interface AbstractQuestionInputData { }

interface IWithTeam {
    team: ReadonlyArray<TTeammate>
}

interface IWithTeammate {
    teammate: TTeammate
}

export interface WallQuestionInputData extends AbstractQuestionInputData { }
export interface CompanyQuestionInputData extends AbstractQuestionInputData { }
export interface TeammateFeedbackQuestionInputData extends AbstractQuestionInputData, IWithTeammate { }
export interface TeamAssertBooleanQuestionInputData extends AbstractQuestionInputData, IWithTeam { }
export interface TeamAssertCheckboxQuestionInputData extends AbstractQuestionInputData, IWithTeam { }

export type TQuestionInputData =
    WallQuestionInputData |
    CompanyQuestionInputData |
    TeammateFeedbackQuestionInputData |
    TeamAssertBooleanQuestionInputData |
    TeamAssertCheckboxQuestionInputData

interface IEmptyStateEmitable {
    emptyStateChanged: BehaviorSubject<boolean>
    checkEmptyAnswer(): void
    isAnswerEmpty(): boolean
}

export interface IQuestionComponent extends IEmptyStateEmitable {
    inputData?: TQuestionInputData;
    get answer(): TAnswer;
}

export abstract class EmptyStateEmitable implements IEmptyStateEmitable {
    emptyStateChanged = new BehaviorSubject<boolean>(true);
    abstract isAnswerEmpty(): boolean
    checkEmptyAnswer(): void {
        const isAnswerEmpty = this.isAnswerEmpty();
        if (this.emptyStateChanged.value !== isAnswerEmpty) {
            this.emptyStateChanged.next(isAnswerEmpty);
        }
    }
}
