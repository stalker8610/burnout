import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'anti-burnout';

    public readonly copyrightMessage = `\u00A9 ALEXROVICH.RU, 2013-${new Date().getFullYear()}`;;

}
