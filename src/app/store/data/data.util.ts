import { IRespondent } from "@models/respondent.model";
import { Scopes } from "@models/user.model";
import { SignUpStatus } from "@models/respondent.model";
import { PersonalFeedbackMood } from "@models/survey.model";

export const concatRespondentName = (respondent: IRespondent ) => {
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

export function getScopeView(scope: Scopes) {
    switch (scope) {
        case Scopes.User: return 'Пользователь';
        case Scopes.HR: return 'HR-менеджер';
        default: return 'Другое'
    }
}

export function getSignUpStatusView(status: SignUpStatus) {
    switch (status) {
        case SignUpStatus.Invited: return 'Приглашение на регистрацию отправлено';
        case SignUpStatus.NotInvitedYet: return 'Приглашение на регистрацию не отправлено';
        case SignUpStatus.SingedUp: return 'Зарегистрирован(-a)';
        case SignUpStatus.Disabled: return 'Учетная запись отключена';
    }
}

export function getPersonalFeedbackView(rate: PersonalFeedbackMood) {

    switch (rate){
        case PersonalFeedbackMood.Angry: return 'Сильно не соответствует ожиданиям';
        case PersonalFeedbackMood.Sad: return 'Не соответствует ожиданиям';
        case PersonalFeedbackMood.Happy: return 'Соответствует ожиданиям';
        case PersonalFeedbackMood.Happier: return 'Превосходит ожидания';
        case PersonalFeedbackMood.Happiest: return 'Сильно превосходит ожидания';
        default: throw 'Unknown personal feedback rate';
    }

}