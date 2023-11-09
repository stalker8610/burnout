import { BehaviorSubject } from 'rxjs';
import { QuestionInputData } from '../survey/survey.component';
import { TAnswer } from '@models/survey.model';

export interface QuestionComponent {
    inputData: QuestionInputData;
    confirmAnswer(): TAnswer;
    emptyAnswer: BehaviorSubject<boolean>;
}