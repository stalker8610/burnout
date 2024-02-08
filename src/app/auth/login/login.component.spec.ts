import { LoginComponent } from "./login.component"
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Store } from "@ngrx/store";
import { AuthActions } from "src/app/store/auth/auth.actions";
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { AppModule } from "src/app/app.module";

describe('login-component test', () => {

    describe('component class tests', () => {

        let store: jasmine.SpyObj<Store>;

        beforeEach(() => {
            const mockStore = jasmine.createSpyObj('Store', ['dispatch']);
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: Store,
                        useValue: mockStore
                    }
                ]
            })

            store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
        })

        it('opened with empty fields', () => {
            const comp = new LoginComponent(store);
            expect(comp.email.value).withContext('Email is empty').toBe('');
            expect(comp.password.value).withContext('Password is empty').toBe('');
        })

        it('dispatches #AuthActions.login action when login', () => {
            const comp = new LoginComponent(store);

            const email = 'mockEmail';
            const password = 'mockPassword';

            comp.email.setValue(email);
            comp.password.setValue(password);
            comp.auth();
            expect(store.dispatch.calls.count()).toBe(1);
            expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ type: AuthActions.login.type, email, password }));
        })
    })

    describe('component DOM test', () => {

        let component: LoginComponent;
        let fixture: ComponentFixture<LoginComponent>;
        let loader: HarnessLoader;

        beforeEach(async () => {
            await TestBed.configureTestingModule({ imports: [AppModule], declarations: [LoginComponent] })
                .compileComponents();
            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            loader = TestbedHarnessEnvironment.loader(fixture);
        })

        it('should create', () => {
            expect(component).toBeDefined();
        });

        it('includes 2 input fields for email and password', async () => {
            const fields = await loader.getAllHarnesses(MatFormFieldHarness);
            expect(fields.length).toBe(2);
        })

        it('doesn\'t allow to login when fields are invalid', async () => {
            const emailField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#email' }));
            expect(await emailField.isControlValid()).toBe(false);

            const passwordField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#password' }));
            expect(await passwordField.isControlValid()).toBe(false);

            const btn = await loader.getHarness(MatButtonHarness)
            expect(await btn.isDisabled()).toBe(true);
        })

        it('allows to login when fields are valid', async () => {

            const btn = await loader.getHarness(MatButtonHarness);

            const emailField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#email' }));
            expect(emailField).toBeDefined();
            const emailControl = await emailField.getControl() as MatInputHarness;
            await emailControl.setValue('mock@email.ru');
            expect(await emailField.isControlValid()).toBe(true);

            const passwordField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#password' }));
            expect(passwordField).toBeDefined();
            const passwordControl = await passwordField.getControl() as MatInputHarness;
            await passwordControl.setValue('mock-password');
            expect(await passwordField.isControlValid()).toBe(true);

            expect(await btn.isDisabled()).toBe(false);

        })

    })

})