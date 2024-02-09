import { MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginStatusComponent } from './login-status.component';

import { getAuthorizedUser, getAuthorizedUserName } from 'src/app/store/auth/auth.selectors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginStatusContainerComponent } from './login-status-container.component';
import { By } from '@angular/platform-browser';

let store: MockStore;
let fixture: ComponentFixture<LoginStatusContainerComponent>;
let component: LoginStatusContainerComponent;

let userSelector: MemoizedSelector<any, any, any>,
    userNameSelector: MemoizedSelector<any, any, any>;

describe('login-status-component test', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, LoginStatusContainerComponent],
            providers: [provideMockStore()]
        })

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(LoginStatusContainerComponent);
        component = fixture.componentInstance;
        
        userSelector = store.overrideSelector(getAuthorizedUser, null);
        userNameSelector = store.overrideSelector(getAuthorizedUserName, '');

    })

    it('should create', () => {
        expect(fixture.componentInstance).toBeDefined();
    })

    it('consist of LoginStatusComponent', () => {
        const loginStatusComponent = fixture.debugElement.query(By.directive(LoginStatusComponent));
        expect(loginStatusComponent).toBeDefined();
    })

    it('provides #authorized and #userName values for LoginStatusComponent', () => {

        const mockUserName = 'Some User Name';

        const loginStatusComponentInstance = fixture.debugElement.query(By.directive(LoginStatusComponent)).componentInstance as LoginStatusComponent
        expect(loginStatusComponentInstance.authorized).toBeFalse();
        expect(loginStatusComponentInstance.userName).toBe('');
        
        userSelector.setResult({});
        userNameSelector.setResult(mockUserName);
        store.refreshState();
        fixture.detectChanges();

        expect(loginStatusComponentInstance.authorized).toBeTrue();
        expect(loginStatusComponentInstance.userName).toBe(mockUserName);

    })
})