import { TObjectId } from '@models/common.model.js';
import { ICompany } from '@models/company.model.js';
import { IRespondent } from '@models/respondent.model.js';
import { PersonalFeedbackMood } from '@models/survey.model';

export interface IReportPersonalEfficiencyRecord {
    respondentId: TObjectId<IRespondent>,
    rates: Array<{
        mood: PersonalFeedbackMood,
        text: number
    }>
}

export interface IReportPersonalEfficiencyResponse extends IReportPersonalEfficiencyRecord {}