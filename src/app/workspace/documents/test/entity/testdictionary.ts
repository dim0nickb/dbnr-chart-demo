/**
 * Created by AtSoft on 2017-10-16
 */

import {CommonLib} from '../../common-lib';
import {Factory} from '../../factory';
import {IEntity} from '../../i-entity';
import {Entity} from '../../entity';



export class Testdictionary extends Entity {

  /**Ключ сущности*/
  keyName: string = 'idtestdictionary';

  /**Наименование сущности*/
  entityName: string = 'testdictionary';

  /**Загрузить из сырого объекта*/
  fromRawObject(source: any): void {
    CommonLib.copyProperty(this, source);

  }

  /**Конструктор*/
  constructor(
        /***/
        public idtestdictionary: number,
        /**Наименование*/
        public name: string,
        /**Комментарий*/
        public comment: string,
        /**Активность*/
        public active: boolean
  ) {
    super();
  }

  /**Получить поля с датами*/
  getFieldDate(): string[] {
      return [];
  }
}


  export class TestdictionaryFactory extends Factory {
  /**Создать новый объект*/
  createNew(tmpId: number): IEntity {
    let varItem = new Testdictionary(null, null, null, null);
    varItem.tmpId = tmpId;
    return varItem;
  }
  /**Создать пустой объект*/
  createEmpty(): IEntity {
    let varItem = new Testdictionary(null, null, null, null);
    return varItem;
  }
}


