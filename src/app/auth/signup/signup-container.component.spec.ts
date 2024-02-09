import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SignupComponent } from "./signup.component"
import { AuthActions } from "src/app/store/auth/auth.actions";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { isSignupTokenValid, isSignUpSuccessful } from "src/app/store/auth/auth.selectors";
import { MemoizedSelector } from "@ngrx/store";
import { SignupContainerComponent } from "./signup-container.component";
import { By } from "@angular/platform-browser";

let fixture: ComponentFixture<SignupContainerComponent>;
let component: SignupContainerComponent;
let store: MockStore;

const fakeFn = () => { };

let isSignupTokenValidSelector: MemoizedSelector<any, any, any>,
    isSignUpSuccessfulSelector: MemoizedSelector<any, any, any>;

const mockToken = 'some-token-value';
const mockPassword = 'some-password';

describe('signup-container-component test', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, SignupContainerComponent],
            providers: [provideMockStore()]
        })

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(SignupContainerComponent);
        component = fixture.componentInstance;

        isSignupTokenValidSelector = store.overrideSelector(isSignupTokenValid, true);
        isSignUpSuccessfulSelector = store.overrideSelector(isSignUpSuccessful, true);

    })

    it('should create', () => {
        expect(component).toBeDefined();
    })

    it('consist of SignupComponent', () => {
        const childComponent = fixture.debugElement.query(By.directive(SignupComponent));
        expect(childComponent).toBeDefined();
    })

    it('method signUp() tied to #signup event', () => {
        const childComponent = fixture.debugElement.query(By.directive(SignupComponent));
        spyOn(component, 'signUp');
        (childComponent.componentInstance as SignupComponent).signUpEvent.emit(mockPassword);
        expect(component.signUp).toHaveBeenCalledOnceWith(mockPassword);
    })

    it('property blockInterface tied to child\'s input blockInterface', () => {
        const childComponent = fixture.debugElement.query(By.directive(SignupComponent)).componentInstance as SignupComponent;

        component.blockInterface = false;
        fixture.detectChanges();
        expect(childComponent.blockInterface).toBe(false);

        component.blockInterface = true;
        fixture.detectChanges();
        expect(childComponent.blockInterface).toBe(true);
    })

    it('dispatches #AuthActions.validateToken on init', () => {
        spyOn(store, 'dispatch').and.callFake(fakeFn);
        component.token = mockToken;
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledOnceWith(jasmine.objectContaining({ type: AuthActions.validateToken.type, token: mockToken }));
    });

    it('dispatches #AuthActions.signup on signUp() call', () => {
        spyOn(store, 'dispatch').and.callFake(fakeFn);
        component.token = mockToken;
        component.signUp(mockPassword);
        expect(store.dispatch).toHaveBeenCalledOnceWith(jasmine.objectContaining({ type: AuthActions.signup.type, token: mockToken, password: mockPassword }));
    });


    it('ui unlocked before init', () => {
        fixture.detectChanges();
        expect(component.blockInterface).toBe(false);
    })

    it('ui locked if token invalid', () => {
        isSignupTokenValidSelector.setResult(false);
        store.refreshState();
        fixture.detectChanges();
        expect(component.blockInterface).toBe(true);
    })

    it('ui locked immediately after signUp() call', () => {

        isSignUpSuccessfulSelector.setResult(true);
        store.refreshState();

        spyOn(store, 'dispatch').and.callFake(fakeFn);
        component.signUp(mockPassword);
        expect(component.blockInterface).toBe(true);
    })

    it('ui unlocked if signup failed', () => {
        isSignUpSuccessfulSelector.setResult(false);
        store.refreshState();

        spyOn(store, 'dispatch').and.callFake(fakeFn);
        component.signUp(mockPassword);
        expect(component.blockInterface).toBe(false);
    })

})