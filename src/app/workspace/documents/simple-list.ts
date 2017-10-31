import {ListComponent} from './list';
import {OnInit} from '@angular/core';
import {ServiceProviderList} from './service-provider-list';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {Factory} from './factory';
import {IEntity} from './i-entity';
import * as Rx from 'rxjs/Rx';
import {ISimpleListFilter} from './i-simple-list-filter'

export class SimpleListComponent extends ListComponent implements OnInit {

  /**Имя таблицы в DOM*/
  tableName: string = 'position_table';

  /**Фильтр для списка*/
  filter: ISimpleListFilter = null;

  /**Конструктор*/
  constructor(public service: ServiceProviderList,
              public route: ActivatedRoute,
              public router: Router,
              public factory: Factory) {
    super(service, router, factory);
  }

  /**Событие отрисовки вьюхи (dom дерево построено)*/
  ngAfterViewChecked(): void {
    // Данные загружены
    if (this.loadComplete) {
      // Выполняем инициализацию только один раз
      if (this.firstViewChecked) {
        this.firstViewChecked = false;
      }
    }
  }

  getFilterFromParam() {
    // Без фильтра по умолчанию
    this.filter = {'idfilterentity': null, 'filter': null};
    // Смотрим параметры списка
    return this.route.params
      .map((params: Params) => {
        // Получаем фильтр если есть
        if (params['idfilterentity'] != null) {
          this.filter.idfilterentity = +params['idfilterentity'];
        }
        if (params['filter'] != null) {
          this.filter.filter = params['filter'];
        }
        return this.filter;
      });
  }

  /**Загрузить данные*/
  loadData(): Rx.AsyncSubject<boolean> {
    let resultLoad = new Rx.AsyncSubject<boolean>();

    // Сбрасываем флаги для перерисовки грида
    this.loadComplete = false;
    this.firstViewChecked = true;

    // Смотрим параметры списка
    this.getFilterFromParam()
      .switchMap((filter: ISimpleListFilter) => {

        // Если есть фильтр, то используем
        if(filter.filter != null && filter.idfilterentity != null) {
          return this.service.getEntityListForParent(filter.filter, filter.idfilterentity, this.factory);
        }
        else {
          return this.service.getEntityList(this.factory);
        }
      })
      .subscribe(
        positions => {
          this.positions = positions;
          // Отмечаем что данные получены.
          this.loadComplete = true;
          this.genAfterLoadData();
          resultLoad.next(true);
          resultLoad.complete();
        },
        error => {
          this.positions = [];
          console.log('Ошибка получения списка');
          console.log(error);
          resultLoad.error(error);
        }
      );

    return resultLoad;
  }

  /**Удалить запись*/
  deleteEntity(entity: IEntity) {
    super.delete(entity)
      .subscribe(
        (result) => {
          // Удаление выполнено успешно - обновить грид
          this.loadData();
        },
        (error) => {
          // TODO - Показать модальное окно с ошибкой
          console.log(`Ошибка удаления ${error}`);
        }
    );
  }

  /**Удалить позицию из коллекции*/
  deleteEntityFromPositions(entity: IEntity) {
    if(this.childMode != 2) {
      throw new Error('deleteEntityFromPositions - возможно для childMode == 2');
      // Т.к. в противном случае удаление должно происходить на сервере
      // Если компонент подчинент, то можно удалить просто из списка
      // Удаление на сервере произойдет при сохранении родительского компонента
    }
    else {
      for (let e of this.positions) {
        if(e.equals(entity)) {
          this.positions.splice(this.positions.indexOf(e), 1);
          break;
        }
      }
    }
  }

}
