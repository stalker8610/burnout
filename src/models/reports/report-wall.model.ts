import { TObjectId } from "@models/common.model"
import { SelfMood } from "@models/survey.model"
import { IRespondent } from "@models/respondent.model"

export interface IReportWallResponse {
    records: IReportWallRecord[]
} 

interface IReportWallRecord {
    date: string,
    mood?: SelfMood,
    text?: string,
    respondentId?: TObjectId<IRespondent>
}