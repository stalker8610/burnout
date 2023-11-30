import { TObjectId } from "@models/common.model"
import { IRespondent } from "@models/respondent.model"
import { ICompany } from "@models/company.model"

export type TCompanyReportQuery = { companyId: TObjectId<ICompany> }
export type TPersonalReportQuery = { companyId: TObjectId<ICompany>, respondentId: TObjectId<IRespondent> }