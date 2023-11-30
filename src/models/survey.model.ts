
import { TObjectId, TWithId } from "./common.model.js"
import { IRespondent } from "./respondent.model.js";
import { IDepartment } from "./department.model.js";

export enum EOperationStatus {
    Wait = 'wait', //wait for user
    Pending = 'pending', //wait for server to complete operation
    Complete = 'complete',
    Failed = 'failed'
}

export type TQuestionType = 'wall' | 'company' | 'personal' | 'boolean' | 'checkbox'

export interface ISurvey {
    respondentId: TObjectId<IRespondent>,
    questions: TWithId<IQuestion>[],
    feedbackToId: TObjectId<IRespondent>,
    createdAt: Date,
    expiredAt: Date,
    finishedAt?: Date,
    progress?: number
}

export interface IQuestion {
    type: TQuestionType,
    title: string,
    category: string,
    inverted: boolean
}

export type TQuestionConfirmedAnswer = {
    questionId: TObjectId<IQuestion>,
    anonymous?: true,
    answer: any
}

export type TQuestionSkipped = {
    questionId: TObjectId<IQuestion>
}

export type TAnswerCompany = {
    score: number
}

export enum SelfMood {
    Sad,
    Neutral,
    Happy
}

export enum PersonalFeedbackMood {
    Angry,
    Sad,
    Happy,
    Happier,
    Happiest
}

export type TAnswerPersonal = { feedbackTo: TObjectId<IRespondent> } &
    ({ newcomer: true } |
    {
        mood?: PersonalFeedbackMood,
        text?: string
    })

export type TAnswerTeamAssertBoolean = { respondentId: TObjectId<IRespondent>, is: boolean }[]

export type TAnswerTeamAssertCheckbox = { respondentId: TObjectId<IRespondent>, is: true }[]

export type TAnswerWall = {
    mood?: SelfMood,
    text?: string
}

export type TAnswer = TAnswerWall | TAnswerPersonal | TAnswerCompany | TAnswerTeamAssertBoolean | TAnswerTeamAssertCheckbox;

interface ISurveyResultBasic {
    surveyId: TObjectId<ISurvey>,
    questionId: TObjectId<IQuestion>,
    date: Date
}

export interface ISurveyResultSkippedQuestion extends ISurveyResultBasic {
    skipped: true,
}

export interface ISurveyResultConfirmedAnswer extends ISurveyResultBasic {
    anonymous?: true,
    answer: TAnswer
}

export type ISurveyResult = ISurveyResultSkippedQuestion | ISurveyResultConfirmedAnswer


export type TTeammate = TWithId<IRespondent> & { department: TWithId<IDepartment> } & { fullName: string };