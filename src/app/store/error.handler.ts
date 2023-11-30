import { of } from 'rxjs'

export interface IBackendError {
    error: string,
    message: string,
    status: number
}


export const handleError = (actionCreator: any, message?: string) => {
    return (error: IBackendError) => {
        console.log(error);
        let errorMessage = message || error.error || error.message;
        if (error.status === 504) {
            errorMessage = 'Сервер недоступен. Попробуйте позже'
        } else if (error.status === 500) {
            errorMessage = 'Произошла ошибка на сервере. Обратитесь в техподдержку'
        }
        return of(actionCreator({ message: errorMessage }))
    }
}
