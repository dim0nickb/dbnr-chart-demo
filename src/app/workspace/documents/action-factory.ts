import {IActionConstructor} from './i-action-constructor';
import {IAction} from './i-action';
import {FormComponent} from './form-component';


/**Фабрика действий*/
export class ActionFactory {

  // Singleton фабрики
  static actionFactory: ActionFactory = new ActionFactory();

  /**Справочник действий*/
  dictionary: { [factoryName: string]: IAction };

  /**Конструктор фабрики, получает конструкторы определенных действий
   * Фабрика удалена из DI из-за проблем с systemjs
   * */
  constructor(//@Inject('PrintCount') public printCount: PrintCount,
              //@Inject('CreateTalkScript') public createTalkScript: CreateTalkScript
  ) {
    this.initDictionary();
  }

  /**Создание действия - Для типизации конструкторов*/
  createAction(ctor: IActionConstructor): IAction {
    return new ctor();
  }

  /**Заполнить справочник*/
  initDictionary() {
    this.dictionary = {
    };
  }

  /**Выполнить действие*/
  perform(actionName: string, form: FormComponent) {
    if (this.dictionary[actionName] == null) {
      throw new Error('Action ' + actionName + ' not found in dictionary');
    }
    this.dictionary[actionName].perform(form);
  }
}
