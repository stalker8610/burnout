import { TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { LogoutComponent } from "./logout.component";
import { AuthActions } from "src/app/store/auth/auth.actions";

describe('logout-component test', () => {

    let store: jasmine.SpyObj<Store>;
    let component: LogoutComponent;

    beforeEach(() => {
        const mockStore = jasmine.createSpyObj('Store', ['dispatch']);
        TestBed.configureTestingModule({
            imports: [LogoutComponent],
            providers: [{ provide: Store, useValue: mockStore }]
        });

        store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
        component = TestBed.createComponent(LogoutComponent).componentInstance;
    })

    it('should create', () => {
        expect(component).toBeDefined();
    })

    it('dispatch #AuthActions.logout on init', () => {
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledOnceWith(jasmine.objectContaining({ type: AuthActions.logout.type }));
    })

})