import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from "./login.component"
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { first } from 'rxjs';

describe('login-component test', () => {

    const mockData = {
        email: 'email@gmail.com',
        password: 'mockPassword'
    }

    describe('component class tests', () => {

        let component: LoginComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({ imports: [LoginComponent] })
            component = new LoginComponent();
        })

        it('initiated with empty fields', () => {
            expect(component.loginGroup.controls.email.value).withContext('Email is empty').toBe('');
            expect(component.loginGroup.controls.password.value).withContext('Password is empty').toBe('');
        })

        it('emits #login event with email and password when login() called', () => {
            component.loginGroup.setValue(mockData);
            component.loginEvent.pipe(first())
                .subscribe(authData => expect(authData).toEqual(mockData))
            component.login();
        })
    })

    describe('component DOM test', () => {

        let component: LoginComponent;
        let fixture: ComponentFixture<LoginComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({ imports: [BrowserAnimationsModule, LoginComponent] });
            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
        })

        it('should create', () => {
            expect(component).toBeDefined();
        });

        it('includes input fields for email and password and button to login', () => {

            const emailInput = fixture.nativeElement.querySelector('input[formControlName=email]');
            expect(emailInput).withContext('email input found').toBeDefined();

            const passwordInput = fixture.nativeElement.querySelector('input[formControlName=password]');
            expect(passwordInput).withContext('password input found').toBeDefined();

            const btn = fixture.nativeElement.querySelector('button');
            expect(btn).withContext('button exist').toBeDefined();

        })

        it('button click calls login()', async () => {
            spyOn(component, 'login');
            const btn = fixture.nativeElement.querySelector('button');
            btn.click();
            fixture.whenStable().then(() => {
                expect(component.login).toHaveBeenCalled();
            });
        })

        it('doesn\'t allow to login when fields are invalid', () => {

            expect(component.loginGroup.controls.email.valid).withContext('empty email control is invalid').toBe(false);
            expect(component.loginGroup.controls.password.valid).withContext('empty password control is invalid').toBe(false);

            fixture.detectChanges();
            const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
            expect(btn.disabled).toBe(true);

        })

        it('allows to login when fields are valid', async () => {
            component.loginGroup.setValue(mockData);

            expect(component.loginGroup.controls.email.valid).withContext('empty email control is valid').toBe(true);
            expect(component.loginGroup.controls.password.valid).withContext('empty password control is valid').toBe(true);

            fixture.detectChanges();
            const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
            expect(btn.disabled).toBe(false);
        })

    })

})