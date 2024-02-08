import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoginStatusComponent } from './login-status.component';
import { AppModule } from 'src/app/app.module';
import { getAuthorizedUser, getAuthorizedUserName } from 'src/app/store/auth/auth.selectors';
import { MemoizedSelector } from '@ngrx/store';

let store: MockStore;
let fixture: ComponentFixture<LoginStatusComponent>;

let userSelector: MemoizedSelector<any, any, any>,
    userNameSelector: MemoizedSelector<any, any, any>;

describe('login-status-component test', () => {
    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [LoginStatusComponent],
            providers: [
                provideMockStore(),
            ]
        }).compileComponents();

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(LoginStatusComponent);

        userSelector = store.overrideSelector(getAuthorizedUser, null);
        userNameSelector = store.overrideSelector(getAuthorizedUserName, '');

    })

    it('should create', () => {
        expect(fixture.componentInstance).toBeDefined();
    })

    it('displays "log in" when no user authorized', () => {

        fixture.detectChanges();

        const loginLink = fixture.debugElement.query(By.css('a[href="/login"]'));
        expect(loginLink).withContext('login link exists').toBeDefined();

        const logoutLink = fixture.debugElement.query(By.css('a[href="/logout"]'));
        expect(logoutLink).withContext('logout link do not exist').toBeNull();

    })

    it('displays "log out" and user name when user is authorized', () => {

        const mockUser = {};
        const mockUserName = 'Some User Name'

        userSelector.setResult(mockUser);
        userNameSelector.setResult(mockUserName);

        store.refreshState();
        fixture.detectChanges();

        const loginLink = fixture.debugElement.query(By.css('a[href="/login"]'));
        expect(loginLink).withContext('login link do not exist').toBeNull();

        const logoutLink = fixture.debugElement.query(By.css('a[href="/logout"]'));
        expect(logoutLink).withContext('logout link exists').toBeDefined();

        const nameSpan = fixture.debugElement.query(By.css('span'));
        expect(nameSpan.nativeElement.textContent).withContext('display user name').toContain(mockUserName);

    })
})