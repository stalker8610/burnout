import { BehaviorSubject } from 'rxjs';
import { QuestionInputData } from '../survey/survey.component';

export interface QuestionComponent {
    inputData: QuestionInputData;
    confirmAnswer(): any;
    emptyAnswer: BehaviorSubject<boolean>;
}