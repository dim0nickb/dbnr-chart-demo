import {Input, OnInit, Output, ViewChild,
  EventEmitter, ComponentFactoryResolver, Type} from '@angular/core';
import {Location} from '@angular/common';
import {CommonComponent} from './common-component';
import {ServiceProvider} from './service-provider';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Factory} from './factory';
import {NgForm} from '@angular/forms';
import {IEntity} from './i-entity';
import * as Rx from 'rxjs/Rx';
import {Entity} from './entity';
import {ActionFactory} from './action-factory';
import {AdDirective} from './ad.directive';
import {getConstructorListComponent} from './factory-component';
import {ListComponent} from './list';
import {WorkspaceComponent} from '../workspace.component';
/**Компонент - форма*/
export class FormComponent
  extends CommonComponent implements OnInit {

  /**Форма, переопределить в наследнике с декоратором*/
  @ViewChild('formComponent')
  form: NgForm;

  /**Ключ компонента*/
  @Input()
  id: number = 0;

  /**Родительский компонент*/
  @Input()
  parent: CommonComponent;

  /**Событие сохранения документа*/
  @Output()
  onDataChanged = new EventEmitter<IEntity>();

  /**Удаление текущей сущности (для модального режима)*/
  @Output()
  onDeleteEntity = new EventEmitter<IEntity>();

  /**Событие загрузки родительского компонента*/
  onLoadParentComponent = new EventEmitter<ILoadParentComponent>();

  /**Сущность*/
  public entity: IEntity;

  /**Изменения данных в компоненте*/
  changed: boolean = false;

  /**Данные для отчета*/
  renderData: string = '';

  /**Директива внедрения компонента*/
  // @ViewChild(AdDirective)
  @ViewChild('common_ad_host')
  adHost: AdDirective;

  /**Библиотека компонент роутинга*/
  childComponents = new Object();

  /**Скрыть данные на вкладке общие*/
  hideCommonContent = false;

  /**Скрыть данные на вкладке общие*/
  hideAdHost = true;

  /**Конструктор*/
  constructor(public service: ServiceProvider,
              public route: ActivatedRoute,
              public router: Router,
              public location: Location,
              public factory: Factory,
              public componentFactoryResolver: ComponentFactoryResolver) {
    super();
    this.entity = this.factory.createEmpty();
  }

  /**Сгенерировать событие изменения документа*/
  private genDataChanged(): void {
    // Генерим событие
    this.onDataChanged.emit(this.entity);
  }

  /**Сгенерировать событие удаления текущей сущности*/
  private genDeleteEntity(entity: IEntity) {
    this.onDeleteEntity.emit(entity);
  }

  /**Статус изменения данных*/
  getChanged(): boolean {
    if (this.form == null) {
      return false;
    }
    return this.form.dirty || this.changed;
  }

  /**Сбросить модификацию данных и данные формы*/
  resetForm(entity: IEntity): void {
    this.changed = false;
    // Если так - то ацкая проблема с датами в контролах
    // this.form.reset(entity);
    // this.form.reset();
  }

  /**Загрузить данные*/
  loadData(): void {
    // Сбрасываем флаги для перерисовки грида
    this.loadComplete = false;
    this.firstViewChecked = true;

    if (this.debug) {
      console.log('loadData -> this.id = ' + this.id);
    }

    if (this.id === 0) {
      // Пустой, грузить не нужно
      let entity = this.factory.createEmpty();
      this.resetForm(entity);
      this.entity.fromRawObject(entity);

      // Отмечаем что данные получены.
      this.loadComplete = true;
      // Генерим событие о загрузке данных
      this.genAfterLoadData();
    } else {
      let res: Rx.Observable<IEntity> = this.service.getEntity(this.id, this.factory);
      res.subscribe((entity: IEntity) => {
          if (entity != null) {
            this.resetForm(entity);
            this.entity.fromRawObject(entity);

            if (this.debug) {
              console.log('loadData -> entity = ');
              console.log(entity);
            }

            // Отмечаем что данные получены.
            this.loadComplete = true;
            // Генерим событие о загрузке данных
            this.genAfterLoadData();
          } else {
            throw Error('Ошибка получения #' + this.id + ';' + this.entity.entityName);
          }
        }
      );
    }
  }

  /**Сохранить используя ввод компонента*/
  onSubmitComponent(): void {
    this.onSubmit().subscribe(
      (result: number) => {
        // Просто сгенерить событие
        this.genDataChanged();
        // Убрать модификацию
        this.resetForm(this.entity);
        // Сделать назад для режима 0
        if (this.childMode === 0) {
          this.closeForm();
        }
      },
      (error: Error) => {
        // TODO - Показать ошибку сохранения
        if(error instanceof ErrorValidateInput) {
          // Ошибка заполнения полей формы
          console.log('Ошибка заполнения полей формы');
        }
        else if(error instanceof ErrorValidate) {
          // Ошибка валидации формы
          console.log('Ошибка валидации формы');
        }
        else {
          // Плохая ошибка
          console.error('Ошибка onSubmitComponent');
          console.error(Error);
        }
      }
    );
  }

  /**Submit*/
  onSubmit(): Rx.AsyncSubject<number> {
    // Результат отправки
    let asyncSubject: Rx.AsyncSubject<number> = new Rx.AsyncSubject<number>();
    if (this.checkValidateOnSubmit()) {
      if (this.childMode === 2) {
        // Асинхронное оповещение о сохранении
        asyncSubject.next(this.entity[this.entity.keyName]);
        asyncSubject.complete();
      } else {
        this.service.postEntity(this.entity).subscribe(
          (idEntity: number) => {
            // Асинхронное оповещение о сохранении
            asyncSubject.next(idEntity);
            asyncSubject.complete();
          },
          (error: Error) => {
            // Асинхронное оповещение о сохранении
            asyncSubject.error(error);
          }
        );
      }
    } else {
      // Не правильно заполнены поля формы.
      if (!this.checkValidateInput()) {
        asyncSubject.error(new ErrorValidateInput('Ошибка заполнения полей формы'));
      }
      else {
        asyncSubject.error(new ErrorValidate('Ошибка валидации формы'));
      }
    }
    return asyncSubject;
  }

  /**После инициализации компонента - инитим всякие контролы*/
  ngOnInit(): void {

    if (this.debug) {
      console.log('ngOnInit -> start');
    }

    this.route.params.map((params: Params) => {
      return params;
    }).subscribe((params: Params) => {

      if (this.debug) {
        console.log('ngOnInit -> params = ' + this.entity);
      }

      if (params[this.entity.keyName] == null) {
      } else {
        let id: number = +params[this.entity.keyName];
        this.id = id;
      }
      // Загрузить
      this.loadData();
    });
  }

  /**Отменить сохранение*/
  cancelChange(): void {
    // TODO Поставить нормальные мессаги
    /*
     if (this.getChanged()) {
     managerSweetAlert.swal(
     {
     title: 'Вы уверены?',
     text: 'Есть не сохраненные данные.',
     type: 'warning',
     showCancelButton: true,
     confirmButtonClass: 'btn btn-info btn-fill',
     confirmButtonText: 'Да, закрыть!',
     cancelButtonText: 'Отменить',
     cancelButtonClass: 'btn btn-danger btn-fill',
     closeOnConfirm: true,
     },
     () => {
     this.genCancel();
     if (this.childMode === 0) {
     this.closeForm();
     }
     });
     } else {
     this.genCancel();
     if (this.childMode === 0) {
     this.closeForm();
     }
     }
     */

    // TODO Убрать
    this.genCancel();
    if (this.childMode === 0) {
      this.closeForm();
    }
  }

  /**Выполнить действие*/
  performAction(actionName: string) {
    ActionFactory.actionFactory.perform(actionName, this);
  }

  /**Проверить правильность заполнения формы перед ее отправкой*/
  validate(): boolean {
    return true;
  }

  /**Проверить валидацию перед отправкой формы*/
  checkValidateOnSubmit() {
    return this.validate() && this.checkValidateInput();
  }

  /**Проверить валидацию полей формы*/
  checkValidateInput() {
    return this.form.valid;
  }

  /**Удалить сущность*/
  deleteEntity(entity: IEntity) {
    // TODO Добавить вопрос об удалении и ошибки вывести в модальные окна!
    if (this.childMode == 0) {
      // Удалить сущность
      if (entity[entity.keyName] == null) {
        // Новая сущность, в базе еще ее нет, просто закрываем компонент
        this.genDeleteEntity(entity);
        // Закрываем форму
        this.closeForm();
      } else {
        this.service.deleteEntity(entity).subscribe(
          (result) => {
            // Удаление сущности выполнено успешно
            this.genDeleteEntity(entity);
            // Закрываем форму
            this.closeForm();
          },
          (error) => {
            // Ошибка удаления
            console.log(`Ошибка удаления сущности: \n${entity}\nОшибка: ${error}`);
          }
        );
      }
    }
    else {
      // Просто сгенерить событие удаления
      this.genDeleteEntity(entity);
    }
  }

  /**Закрыть форму - перейти к пред. контролу*/
  closeForm() {
    this.router.navigate([WorkspaceComponent.getPrevUrl()]);
  }

  /**Загрузить компонент
   * Передаем функцию конструктор объекта с переменным числом параметров (для инжектора)
   * Передаем хост директиву
   */
  loadComponent<T extends CommonComponent>(component: Type<T>, adHost?: AdDirective): T {

    // Текущий хост, в который делаем направление
    let currentAdHost = adHost ? adHost : this.adHost;

    // Фабрика компонента
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    // Контейнер для присоединения видов (туда ложим компонент)
    let viewContainerRef = currentAdHost.viewContainerRef;
    viewContainerRef.clear();

    // Создаем компонент в контейнере
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<T>componentRef.instance).childMode = 1;

    return <T>componentRef.instance;

  }

  /**Открыть формы родительского справочника*/
  loadParentComponent(componentName: string, methodName: string, fieldName: string): void {

    // Получаем конструктор компонента
    let component = getConstructorListComponent(componentName);

    // Если в фабрике нет конструктора
    if (component == null) {
      throw new Error(`Ошибка получения конструктора компонента ${componentName} из фабрики`);
    }

    // Динамически создаем компонент выбора из справочника
    let instanceComponent = this.loadComponent(component);
    // Вызвать событие перед открытием формы выбора
    this.onLoadParentComponent.emit({
      'componentName': componentName,
      'methodName': methodName,
      'fieldName': fieldName,
      'listComponent': instanceComponent
    });

    // Показать компоненту
    this.hideCommonContent = true;
    this.hideAdHost = false;

    // Результат выбора пользователем
    let asyncSubject: Rx.AsyncSubject<IEntity> = new Rx.AsyncSubject<IEntity>();

    // Выбор компоненты
    instanceComponent.onSelect.subscribe(
      (entity: IEntity) => {
        asyncSubject.next(entity);
        asyncSubject.complete();
      });

    // Отмена выбора компонента
    instanceComponent.onCancel.subscribe(
      () => {
        // Показать компоненту
        this.hideCommonContent = false;
        this.hideAdHost = true;

        // Отмена выбора, цепочка обрывается
        asyncSubject.complete();
      });

    // После выбора сущности
    asyncSubject.subscribe(
      (entity: IEntity) => {
        this[methodName](entity)
          .subscribe((result: boolean) => {
            if (result) {
              // Показать компоненту
              this.hideCommonContent = false;
              this.hideAdHost = true;
            }
          });
      },
      (error: Error) => {
        throw error;
      }
    );
  }

  /**Перейти к редактированию родительской сущности*/
  goToRouteEditEntity(keyFieldName: string, parentKeyFieldName: string) {
    // Получить имя сущности по ключу
    let parentEntityName = parentKeyFieldName.replace(/^id/, '');
    if(this.entity[keyFieldName] == null) {
      // Пока отключим роут к созданию сущности
      // this.goToRoute('/documents/' + parentEntityName + '/new');
    }
    else {
      this.goToRoute('/documents/' + parentEntityName + '/edit/' + this.entity[keyFieldName]);
    }

  }

  /**Перейти по маршруту с проверкой необходимости сохранения документа*/
  goToRoute(routeUrl: string) {
    // Результат - можно переходить дальше или ошибка
    let asyncSubject: Rx.AsyncSubject<number> = new Rx.AsyncSubject<number>();

    // Есть ли изменения
    if(this.getChanged()) {
      // Можно ли сохранить
      if (this.checkValidateOnSubmit()) {
        // TODO - запрос на сохранение, если да - то сохраняем и продолжаем
        this.onSubmit().subscribe(asyncSubject);
      }
      else {
        asyncSubject.error(new Error('Не валидная форма, сохранят нельзя'));
      }
    }
    else {
      // Форма без модификаций - можно переходить дальше
      asyncSubject.next(this.entity[this.entity.keyName]);
      asyncSubject.complete();
    }

    // Результат действий по сохранению
    asyncSubject.subscribe(
      (result: number) => {
        // '/documents/talkscriptdoc/edit/' + idtalkscriptdoc
        this.router.navigate([routeUrl]);
      },
      (error: Error) => {
        console.log('Ошибка сохранение документа, переход отменен!');
        // TODO - Мессга - нужно сохранить сначала, а не получается, не валидные данные
      }
    );
  }

  /**Для переход по ссылке*/
  routerLinkApply(navigateParam: string) {
    // Именованные аутлет с параметрами фильтрации
    let outlets = new Object();
    outlets[`ro_${navigateParam}`] = [navigateParam, this.entity[this.entity.keyName], this.entity.entityName];
    // Конфиг навигации
    let navigate = {outlets: outlets};
    // Перейти к именованному аутлету
    return Rx.Observable.fromPromise(this.router.navigate([navigate], { relativeTo: this.route }));
  }

  /**Активация компонента в через роутинг*/
  onActivate(form: any) {
    this.childComponents[form.constructor.name] = form;
    form['formComponent'] = this;
  }

  /**Деактивация компонента в через роутинг*/
  onDeactivate(form: any) {
    if(this.childComponents.hasOwnProperty(form.constructor.name)) {
      delete this.childComponents[form.constructor.name];
    }
  }

}

/**Ошибка заполнения полей формы (на основании данных из шаблона компонента)*/
export class ErrorValidateInput extends Error{

}

/**Ошибка валидации, генерируется в декораторе*/
export class ErrorValidate extends Error{

}

export interface ILoadParentComponent {
  componentName: string,
  methodName: string,
  fieldName: string,
  listComponent: ListComponent
}
