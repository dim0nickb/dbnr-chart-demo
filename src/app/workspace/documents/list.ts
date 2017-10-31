import {CommonComponent} from './common-component';
import {Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {IEntity} from './i-entity';
import {FormComponent} from './form-component';
import {ServiceProvider} from './service-provider';
import {Router} from '@angular/router';
import {Factory} from './factory';
import {CommonLib} from './common-lib';
import {ColumnInfo} from 'at-grid';
import * as Rx from 'rxjs/Rx';
/**Компонент списков*/
export class ListComponent extends CommonComponent implements OnInit {

  /**Роут для редактирования позиции*/
  urlEditPosition: string = '/edit/';

  /**Роут для редактирования позиции*/
  urlNewPosition: string = '/new';

  /**Позиции*/
  @Input()
  positions: IEntity[] = [];

  /**Выделене какой-то позиции*/
  @Output()
  onSelect = new EventEmitter<IEntity>();

  @ViewChild('')
  formComponent: FormComponent;

  /**Заголовки колонок*/
  gridMetaData: ColumnInfo[] = [];

  /**Конструктор*/
  constructor(public service: ServiceProvider,
              public router: Router,
              public factory: Factory) {
    super();
  }


  /**Генерим событие выбора*/
  genSelect(position: IEntity): void {
    this.onSelect.emit(position);
  }

  /**Загрузить данные*/
  loadData(): void {
  }

  /**Клик по строке*/
  selectRow(position: IEntity): void {
    if (this.childMode === 1) {
      this.genSelect(position);
    } else if (this.childMode === 2) {
      // Открыть форму редактирование сущности без роутинга
      if (this.debug) {
        console.log('ListComponent -> selectRow -> childMode == 2');
      }
      this.formComponent.entity = position;
      this.formComponent.childMode = 2;
      this.setActiveForm(2);
    } else {
      this.router.navigateByUrl(this.urlEditPosition + position[position.keyName]);
    }
  }

  /**Создать новую запись*/
  createNew(): void {
    if (this.childMode === 2) {
      // Открыть форму редактирование сущности без роутинга
      if (this.debug) {
        console.log('ListComponent -> createNew -> childMode == 2');
      }
      this.formComponent.entity = this.factory.createNew(CommonLib.getNewTempId(this.positions));
      this.setActiveForm(2);
    } else {
      this.router.navigate([this.urlNewPosition]);
    }
  }

  /**После инита - загрузить данные*/
  ngOnInit(): void {
    if(this.childMode == 2) {
      // Компонент вложен в другой компонент, получает данные на халяву :)
      // через Input параметр
      // Сгенерить событие что данные получены
      this.genAfterLoadData();
    } else {
      this.loadData();
    }
  }

  /**Удалить запись*/
  delete(entity: IEntity): Rx.Observable<IEntity> {
    // TODO Поставить нормальные мессаги
    /*
     managerSweetAlert.swal(
     {
     title: 'Вы уверены?',
     text: 'Удаление запись.',
     type: 'warning',
     showCancelButton: true,
     confirmButtonClass: 'btn btn-info btn-fill',
     confirmButtonText: 'Да, удалить!',
     cancelButtonText: 'Отменить',
     cancelButtonClass: 'btn btn-danger btn-fill',
     closeOnConfirm: true,
     },
     () => {
     if (entity[entity.keyName] == null) {
     // Удалить в интерфейсе
     funcDelete(entity[entity.keyName]);
     } else {
     // Удалить на сервере
     this.service.deleteEntity(entity).subscribe(
     (response: any) => {
     // Удалить в интерфейсе
     funcDelete(entity[entity.keyName]);
     },
     (error: any) => {
     this.positions = [];
     console.log('Ошибка удаления!');
     console.log(error);

     managerSweetAlert.swal(
     {
     title: 'Ошибка удаления!',
     text: '',
     type: 'error',
     confirmButtonClass: 'btn btn-info btn-fill',
     confirmButtonText: 'Ок',
     closeOnConfirm: true
     },
     () => {
     }
     );
     }
     );
     }
     }
     );
     */

    // TODO Удалить после постановки мессаг нормальных
    let observable = Rx.Observable.create((observer: Rx.Observer<IEntity>) => {
      if (entity[entity.keyName] == null) {
        // В списке сущность без первичного ключа
        observer.error(new Error('В списке сущность без первичного ключа'));
      } else {
        // Удалить на сервере
        this.service.deleteEntity(entity).subscribe(
          (response: boolean) => {
            observer.next(entity);
          },
          (error: any) => {
            observer.error(error);
          });
      }
    });
    return observable;
  }

  /**ИД строки в DOM*/
  getRowId(entity: IEntity): string {
    return 'comp_' + this.componentName + '_row_' + entity[entity.keyName] + '_tmpId_' + entity.tmpId;
  }

  /**Поредактировали в форме сущность без роутинга*/
  editEntity(entity: IEntity) {
    if (this.debug) {
      console.log('ListComponent -> editEntity -> entity.keyName = ' + entity[entity.keyName]);
    }
    // Если нет такой то добавляем в коллекцию (новая, и в базе ее нет)
    let found = false;
    for (let existsEntity of this.positions) {
      if (existsEntity.equals(entity)) {
        found = true;
      }
    }
    if (!found) {
      this.positions.push(entity);
    }
    // Активируем главный вид
    this.setActiveMasterView();
  }
}
