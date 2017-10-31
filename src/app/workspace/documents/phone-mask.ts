import {Directive, ElementRef, Renderer} from '@angular/core';
import {NgControl} from '@angular/forms';

/**
 * Created by Николай on 19.09.2017.
 */
@Directive({
  selector: '[ngModel][phone]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown.backspace)': 'onInputChange($event.target.value, true)'
  }
})

/**Директива - Телефонные маски*/
export class PhoneMask {
  constructor(public model: NgControl,
              public renderer: Renderer,
              public el: ElementRef) {
  }

  /**Изменение ввода*/
  onInputChange(event: any, backspace: any) {

    // Текущая позиция курсора
    let start = this.el.nativeElement.selectionStart;
    let end = this.el.nativeElement.selectionEnd;

    // Количество не цифер
    let quNoDigitOld = 0;
    if (event.match(/\D/g) != null) {
      quNoDigitOld = event.match(/\D/g).length;
    }

    // Удалить все кроме цифер
    let newVal = event.replace(/\D/g, '');

    // Добавляем разделители
    if (newVal.length == 0) {
      newVal = '';
    } else if (newVal.length <= 1) {
      newVal = newVal.replace(/^(\d{0,1})/, '+$1');
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})/, '+$1($2');
    } else if (newVal.length <= 7) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})/, '+$1($2) $3');
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})/, '+$1($2) $3-$4');
    } else {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(.*)/, '+$1($2) $3-$4-$5');
    }

    // Количество не цифер после замен
    let quNoDigitNew = 0;
    if (newVal.match(/\D/g) != null) {
      quNoDigitNew = newVal.match(/\D/g).length;
    }


    // Сдвинуть курсор на добавленные/удаленные разделители
    start += quNoDigitNew - quNoDigitOld;
    end += quNoDigitNew - quNoDigitOld;

    // Установить новое значение
    this.model.valueAccessor.writeValue(newVal);

    // Установить позицию курсора
    this.el.nativeElement.setSelectionRange(start, end);
  }
}
