import { TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { LogoutComponent } from "./logout.component";
import { AuthActions } from "src/app/store/auth/auth.actions";

describe('logout component test', () => {

    let store: jasmine.SpyObj<Store>;

    beforeEach(() => {
        const mockStore = jasmine.createSpyObj('Store', ['dispatch']);
        TestBed.configureTestingModule({
            providers: [{ provide: Store, useValue: mockStore }]
        });

        store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    })

    it('dispatch #AuthActions.logout on init', () => {

        const comp = TestBed.createComponent(LogoutComponent).componentInstance;
        comp.ngOnInit();

        expect(store.dispatch.calls.count()).withContext('dispatch once').toBe(1);
        expect(store.dispatch).withContext('called with #AuthActions.logout action')
            .toHaveBeenCalledWith(jasmine.objectContaining({ type: AuthActions.logout.type }));

    })

})