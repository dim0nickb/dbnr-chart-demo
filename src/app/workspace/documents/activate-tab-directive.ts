import {Directive, ViewContainerRef, ElementRef} from '@angular/core';

/**Активацая таба по роутингу*/
@Directive({
  selector: '[activate-tab]',
})
export class ActivateTabDirective {
  /***/
  constructor(public viewContainerRef: ViewContainerRef,
              public element: ElementRef) { }


}
