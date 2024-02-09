import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginStatusComponent } from './login-status.component';

let fixture: ComponentFixture<LoginStatusComponent>;
let component: LoginStatusComponent;

describe('login-status-component test', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [BrowserAnimationsModule, LoginStatusComponent] })
        fixture = TestBed.createComponent(LoginStatusComponent);
        component = fixture.componentInstance;
    })

    it('should create', () => {
        expect(fixture.componentInstance).toBeDefined();
    })

    it('sets defaults to inputs', () => {
        fixture.detectChanges();
        expect(component.authorized).toBeFalse();
        expect(component.userName).toBe('');
    })

    it('displays "log in" if no authorized user', () => {

        component.authorized = false;
        fixture.detectChanges();

        const loginLink = fixture.nativeElement.querySelector('a[href="/login"]');
        expect(loginLink).withContext('login link exists').toBeDefined();

        const logoutLink = fixture.nativeElement.querySelector('a[href="/logout"]');
        expect(logoutLink).withContext('logout link do not exist').toBeNull();

    })

    it('displays "log out" and user name for authorized user', () => {

        component.authorized = true;
        component.userName = 'Some User Name';
        fixture.detectChanges();

        const loginLink = fixture.nativeElement.querySelector('a[href="/login"]');
        expect(loginLink).withContext('login link do not exist').toBeNull();

        const logoutLink = fixture.nativeElement.querySelector('a[href="/logout"]');
        expect(logoutLink).withContext('logout link exists').toBeDefined();

        const nameSpan = fixture.nativeElement.querySelector('span');
        expect(nameSpan.textContent).withContext('display user name').toContain(component.userName);

    })
})