import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[questionHost]',
    standalone: true
})
export class QuestionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
