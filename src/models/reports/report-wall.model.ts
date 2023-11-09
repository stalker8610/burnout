import { SelfMood } from "@models/survey.model"

export interface IReportWallRecord {
    date: string,
    mood?: SelfMood,
    text?: string
}