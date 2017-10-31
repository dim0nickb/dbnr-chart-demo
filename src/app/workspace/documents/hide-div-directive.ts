import {Directive, ElementRef, Input, ViewContainerRef, Renderer2} from '@angular/core';
import {FormComponent} from './form-component';

/**Управление видимостью элементом*/
@Directive({
  selector: '[hideDiv]'
})
export class HideDivDirective {

  /**Показать/скрыть элемент*/
  @Input('hideDiv')
  set setHideDiv(value: boolean) {

    // Текущее значение сохраняем
    this.hideDiv = value;

    // Добавить/удалить класс hidden
    if (this.hideDiv) {
      this.renderer.addClass(this.element.nativeElement, 'hidden');
    }
    else {
      this.renderer.removeClass(this.element.nativeElement, 'hidden');
    }
  }

  /**Текущее состояние*/
  hideDiv = false;

  /**Конструктор*/
  constructor(public vcRef: ViewContainerRef,
              public element: ElementRef,
              public renderer: Renderer2) {

    // Если нужна форма, то тогда так vcRef.injector['view']['component'] as FormComponent;
  }
}
