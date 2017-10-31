import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ad-host]',
  exportAs: 'adhost'
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
