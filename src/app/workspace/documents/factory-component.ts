
import {CommonComponent} from './common-component';
import {Type} from '@angular/core';
import {ListComponent} from './list';

// test


/**Констркуторы всех компонент*/
let ctorsComponent: { [componentName: string]: Type<CommonComponent> } = {
  // test
}

/**Конструкторы списочных компонент*/
let ctorsListComponent: { [componentName: string]: Type<ListComponent> } = {
  // test
}

/**Получить конструктор компонента, если нет, то null*/
export function getConstructorComponent(componentName: string): Type<CommonComponent> {
  return ctorsComponent[componentName];
}

/**Получить конструктор списочного компонента, если нет, то null*/
export function getConstructorListComponent(componentName: string): Type<ListComponent> {
  return ctorsListComponent[componentName];
}
