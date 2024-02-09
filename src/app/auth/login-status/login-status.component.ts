import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginStatusComponent {

    @Input() userName = '';
    @Input() authorized = false;

}
