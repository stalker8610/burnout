
import { TObjectId, TWithId } from "./common.model.js"
import { IRespondent } from "./respondent.model.js";

export type TQuestionType = 'wall' | 'company' | 'personal' | 'boolean' | 'checkbox'

export interface ISurvey {
    respondentId: TObjectId<IRespondent>,
    questions: TWithId<IQuestion | {}>[],
    feedbackToId: TObjectId<IRespondent>,
    createdAt: Date,
    expiredAt: Date,
    finishedAt?: Date,
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

export type TAnswerPersonal = {
    newcomer: true
} | {
    mood?: PersonalFeedbackMood,
    text?: string
}

export type TAnswerTeamAssertBoolean = Record<TObjectId<IRespondent>, boolean>

export type TAnswerTeamAssertCheckbox = TObjectId<IRespondent>[]

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
