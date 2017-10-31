import {IAction} from './i-action';
/**Интерфейс для конструктора действия*/
export interface IActionConstructor {
  new (): IAction;
}

