import { Observable } from 'rxjs';
import { reportActions } from "./report-generator.actions";
import { reportReducer } from "./report-generator.reducer";
import { createSelectors } from "./report-generator.selectors";
import { createEffects } from "./report-generator.effects";
import { ReportService } from "src/app/services/report.service";

export const registerReport = <T, K>(reportName: string, featureKey: string, dataLoader: (reportService: ReportService, query: K) => Observable<T>) => {

    const actions = reportActions<T, K>(reportName);
    const reducer = reportReducer<T, K>(reportName);
    const selectors = createSelectors<T>(featureKey);
    const effects = createEffects<T, K>(
        actions,
        selectors,
        dataLoader
    )

    return {
        actions,
        reducer,
        selectors,
        effects
    }

}