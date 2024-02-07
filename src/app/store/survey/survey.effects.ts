import { createEffect } from "@ngrx/effects"
import { Actions, ofType } from "@ngrx/effects"
import { SurveyActions } from './survey.actions'
import { concatLatestFrom } from "@ngrx/effects"
import { map, catchError, exhaustMap, of, filter, tap } from "rxjs"
import { inject } from '@angular/core'
import { Store } from "@ngrx/store"
import { getCurrentQuestionIndex, getLoaded, getSurvey } from "./survey.selectors"
import { SurveyService } from "src/app/services/survey.service"
import { handleError } from "../error.handler"

export const loadDataRequested$ = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(SurveyActions.loadRequested),
            concatLatestFrom(() => store.select(getLoaded)),
            filter(([action, loaded]) => !loaded),
            exhaustMap(([action, loaded]) => of(SurveyActions.load(action)))
        ),
    { functional: true }
)

export const loadData$ = createEffect(
    (actions$ = inject(Actions), surveyService = inject(SurveyService)) =>
        actions$.pipe(
            ofType(SurveyActions.load),
            exhaustMap(action => {
                return (() => {
                    if ('respondentId' in action) {
                        return surveyService.getLastSurveyForRespondent(action.respondentId)
                    }
                    return surveyService.getSurveyById(action.surveyId)
                })().pipe(
                    map(survey => SurveyActions.loadSuccessful({ survey })),
                    catchError(handleError(SurveyActions.loadFailed))
                )
            }
            )
        ),
    { functional: true }
)

export const nextQuestionRequested$ = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(SurveyActions.nextQuestionRequested),
            concatLatestFrom(() => [
                store.select(getCurrentQuestionIndex),
                store.select(getSurvey)]),
            filter(([action, currentQuestionId, survey]) => !!survey),
            exhaustMap(([action, currentQuestionId, survey]) => {
                if (currentQuestionId === survey!.questions.length - 1) {
                    return of(SurveyActions.surveyCompleted({ surveyId: survey!._id }))
                }
                return of(SurveyActions.nextQuestionRequestCompleted())
            })
        ),
    { functional: true }
)

export const confirmAnswer$ = createEffect(
    (actions$ = inject(Actions), surveyService = inject(SurveyService), store = inject(Store)) =>
        actions$.pipe(
            ofType(SurveyActions.answerConfirmed),

            exhaustMap(action => surveyService.confirmAnswer(action.surveyId, action.answer).pipe(
                map(() => SurveyActions.operationCompletedSuccessful()),
                catchError(handleError(SurveyActions.operationFailed))
            ))
        ),
    { functional: true }
)

export const skipQuestion$ = createEffect(
    (actions$ = inject(Actions), surveyService = inject(SurveyService), store = inject(Store)) =>
        actions$.pipe(
            ofType(SurveyActions.questionSkipped),
            exhaustMap(action => surveyService.skipQuestion(action.surveyId, action.skipped).pipe(
                map(() => SurveyActions.operationCompletedSuccessful()),
                catchError(handleError(SurveyActions.operationFailed))
            )
            )
        ),
    { functional: true }
)

export const surveyCompleted$ = createEffect(
    (actions$ = inject(Actions), surveyService = inject(SurveyService)) =>
        actions$.pipe(
            ofType(SurveyActions.surveyCompleted),
            exhaustMap(action => surveyService.completeSurvey(action.surveyId).pipe(
                map(survey => SurveyActions.surveyCompleteSuccessful({ survey })),
                catchError(handleError(SurveyActions.operationFailed))
            ))
        ),
    { functional: true }
)


export const operationCompleteSuccessful$ = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(SurveyActions.operationCompletedSuccessful),
            exhaustMap(() => of(SurveyActions.nextQuestionRequested()))
        ),
    { functional: true }
)


