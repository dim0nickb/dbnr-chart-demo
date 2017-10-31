/**
 * Created by AtSoft on 2017-10-16
 */

import {CommonLib} from '../../common-lib';
import {Factory} from '../../factory';
import {IEntity} from '../../i-entity';
import {Entity} from '../../entity';



export class Testdocitem extends Entity {

  /**Ключ сущности*/
  keyName: string = 'idtestdocitem';

  /**Наименование сущности*/
  entityName: string = 'testdocitem';

  /**Загрузить из сырого объекта*/
  fromRawObject(source: any): void {
    CommonLib.copyProperty(this, source);

  }

  /**Конструктор*/
  constructor(
        /***/
        public idtestdocitem: number,
        /**Наименование*/
        public name: string,
        /***/
        public comment: string,
        /**Супер справочник*/
        public idtestdictionary: number,
        /***/
        public idtestdoc: number,
        /***/
        public testdoc_name: string,
        /**Супер справочник*/
        public testdictionary_name: string
  ) {
    super();
  }

  /**Получить поля с датами*/
  getFieldDate(): string[] {
      return [];
  }
}


  export class TestdocitemFactory extends Factory {
  /**Создать новый объект*/
  createNew(tmpId: number): IEntity {
    let varItem = new Testdocitem(null, null, null, null, null, null, null);
    varItem.tmpId = tmpId;
    return varItem;
  }
  /**Создать пустой объект*/
  createEmpty(): IEntity {
    let varItem = new Testdocitem(null, null, null, null, null, null, null);
    return varItem;
  }
}


