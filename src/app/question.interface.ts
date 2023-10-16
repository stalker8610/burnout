import { BehaviorSubject } from 'rxjs';

export interface QuestionComponent {
    inputData?: any;
    confirmAnswer(): any;
    emptyAnswer: BehaviorSubject<boolean>;
}