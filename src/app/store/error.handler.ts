import { of } from 'rxjs'

export interface IBackendError {
    error: string,
    message: string,
    status: number
}


export const handleError = (actionCreator: any, message?: string) => {
    return (error: IBackendError) => {
        let errorMessage = message || error.error || error.message;
        if (error.status === 504) {
            errorMessage = 'Сервер недоступен. Попробуйте позже'
        }
        return of(actionCreator({ message: errorMessage }))
    }
}
