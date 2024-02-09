import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SignupComponent } from "./signup.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { first } from "rxjs";

let fixture: ComponentFixture<SignupComponent>;
let component: SignupComponent;

const mockPassword = 'some-password';

describe('signup-component test', () => {

    describe('component class test', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SignupComponent]
            })
            component = new SignupComponent();
        })

        it('set block interface default to false', () => {
            expect(component.blockInterface).toBeFalse();
        })

        it('emits #singup event on signUp() call', () => {

            component.passwordGroup.setValue({
                password: mockPassword,
                passwordConfirm: mockPassword
            });

            component.signUpEvent.pipe(first())
                .subscribe(value => expect(value).toBe(mockPassword));

            component.signUp();
            
        });

    });

    describe('component DOM test', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrowserAnimationsModule, SignupComponent],
            })
            fixture = TestBed.createComponent(SignupComponent);
            component = fixture.componentInstance;
        })

        it('should create', () => {
            expect(component).toBeDefined();
        });

        it('has fields for password, confirm password and signup button', async () => {
            const passwordInput = fixture.nativeElement.querySelector('input[formControlName=password]');
            expect(passwordInput).toBeDefined();

            const passwordConfirmInput = fixture.nativeElement.querySelector('input[formControlName=passwordConfirm]');
            expect(passwordConfirmInput).toBeDefined();

            const btn = fixture.nativeElement.querySelector('button');
            expect(btn).toBeDefined();
        })

        it('signup btn calls signUp()', async () => {
            const btn = fixture.nativeElement.querySelector('button');
            spyOn(component, 'signUp');
            btn.click();
            await fixture.whenStable();
            expect(component.signUp).toHaveBeenCalled();
        })

        it('blockInterface makes form group disabled', async () => {
           
            component.blockInterface = false;
            component.ngOnChanges();
            expect(component.passwordGroup.disabled).toBe(false);
            
            component.blockInterface = true;
            component.ngOnChanges();
            expect(component.passwordGroup.disabled).toBe(true);

        })

        it('signup button always disabled when blockInterface = true', () => {

            fixture.detectChanges();

            component.passwordGroup.setValue({
                password: mockPassword,
                passwordConfirm: mockPassword
            });

            component.passwordGroup.markAllAsTouched();

            const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

            component.blockInterface = false;
            component.ngOnChanges();
            fixture.detectChanges();
            expect(btn.disabled).toBe(false);

            component.blockInterface = true;
            component.ngOnChanges();
            fixture.detectChanges();
            expect(btn.disabled).toBe(true);

        })

        it('signup button state tied to password-confirm\'s match', () => {

            fixture.detectChanges(); //set defaults to passwordGroup controls

            const passwordInput = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;
            const passwordConfirmInput = fixture.nativeElement.querySelector('input[formControlName=passwordConfirm]') as HTMLInputElement;
            const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

            expect(btn.disabled).withContext('when empty and not touched').toBe(true);

            passwordInput.dispatchEvent(new Event('blur')); //mark control as touched
            expect(btn.disabled).withContext('when empty and touched').toBe(true);

            passwordInput.value = mockPassword;
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(btn.disabled).withContext('when filled and do not match').toBe(true);

            passwordConfirmInput.dispatchEvent(new Event('blur')); //mark control as touched
            passwordConfirmInput.value = mockPassword.slice(0, -1);
            passwordConfirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(btn.disabled).withContext('when filled and do not match').toBe(true);

            passwordConfirmInput.value = mockPassword;
            passwordConfirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(btn.disabled).withContext('when filled and match').toBe(false);

            passwordInput.value = '';
            passwordInput.dispatchEvent(new Event('input'));
            passwordConfirmInput.value = '';
            passwordConfirmInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(btn.disabled).withContext('when clear to empty and match').toBe(true);

        })

    })
})