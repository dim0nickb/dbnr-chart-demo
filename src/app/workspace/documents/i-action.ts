import {FormComponent} from './form-component';
/**Действие*/
export interface IAction {
  /**Выполнить*/
  perform(form: FormComponent): void;
}
