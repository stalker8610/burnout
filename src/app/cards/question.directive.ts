import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[questionHost]'
})
export class QuestionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
