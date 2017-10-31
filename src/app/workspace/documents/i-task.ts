import {CommonComponent} from './common-component';
/**Задача - всегда возвращает контекст выполнения*/
export interface ITask {
  (...args: any[]): void;
}
