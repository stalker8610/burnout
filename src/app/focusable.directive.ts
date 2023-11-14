import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appFocusable]'
})
export class FocusableDirective {

    constructor(private el: ElementRef) { }

    public ngAfterViewInit() {
        setTimeout(() => this.el.nativeElement.focus());
    }

}
