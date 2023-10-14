import { IUser } from "./company.types.js"

export enum QuestionTypes {
    AboutUserTrueFalse = 'aboutUserTrueFalse',
    AboutUserCheckbox = 'aboutUserCheckbox',
    AboutCompany = 'aboutCompany'
}

export interface IQuestionCategory {
    title: string
}

export interface IQuestion {
    title: string,
    type: QuestionTypes,
    category: IQuestionCategory
}

export interface ISurvey {
    questions: IQuestion[]
}

export interface ISurveyResult {
    survey: ISurvey,
    user: IUser,
    date: Date
}