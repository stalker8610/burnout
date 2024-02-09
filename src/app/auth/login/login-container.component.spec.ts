import { LoginContainerComponent } from "./login-containter.component";
import { Store } from "@ngrx/store";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { AuthActions } from "src/app/store/auth/auth.actions";
import { LoginComponent } from "./login.component";
import { By } from "@angular/platform-browser";

describe('login-container-component test', () => {

    let store: jasmine.SpyObj<Store>;
    let component: LoginContainerComponent;
    let fixture: ComponentFixture<LoginContainerComponent>;

    const mockData = {
        email: 'email@gmail.com',
        password: 'mockPassword'
    }

    beforeEach(() => {
        const mockStore = jasmine.createSpyObj('Store', ['dispatch']);
        TestBed.configureTestingModule({
            imports: [LoginContainerComponent],
            providers: [{ provide: Store, useValue: mockStore }]
        })

        store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
        fixture = TestBed.createComponent(LoginContainerComponent);
        component = fixture.componentInstance;
    })

    it('should create', () => {
        expect(component).toBeDefined();
    })

    it('consist of LoginComponent', () => {
        const loginComponent = fixture.debugElement.query(By.directive(LoginComponent));
        expect(loginComponent).toBeDefined();
    })

    it('method auth() tied to #login event', () => {
        const loginComponent = fixture.debugElement.query(By.directive(LoginComponent));
        expect(loginComponent).toBeDefined();

        spyOn(component, 'auth');
        (loginComponent.componentInstance as LoginComponent).loginEvent.emit(mockData);
        expect(component.auth).toHaveBeenCalledOnceWith(jasmine.objectContaining(mockData));
    })

    it('dispatches #AuthActions.login action when auth() called', () => {
        component.auth(mockData);
        expect(store.dispatch).toHaveBeenCalledOnceWith(
            jasmine.objectContaining(Object.assign({ type: AuthActions.login.type }, mockData))
        );
    })
})