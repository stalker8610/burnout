import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, Observable, retry } from 'rxjs';

export class AbstractHttpService {

    constructor(protected readonly httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.error));
    }

    protected pipeRequest(request: Observable<any>) {
        return request.pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError))
    }

}