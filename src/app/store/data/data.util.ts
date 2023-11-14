import { IRespondent } from "@models/respondent.model";

export const concatRespondentName = (respondent: IRespondent) => {
    return `${respondent.lastName || ''} ${respondent.firstName || ''} ${respondent.middleName || ''}`.trim();

}

export const parseName = (name: string) => {

    const result = {
        firstName: '',
        lastName: '',
        middleName: ''
    }

    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
        result.lastName = nameParts[0]
    } else if (nameParts.length === 2) {
        result.lastName = nameParts[0];
        result.firstName = nameParts[1];
    } else {
        result.lastName = nameParts[0];
        result.firstName = nameParts[1];
        result.middleName = nameParts[2];
    }

    return result;

}