/**
 * Created by AtSoft on 2017-10-16
 */

import {CommonLib} from '../../common-lib';
import {Factory} from '../../factory';
import {IEntity} from '../../i-entity';
import {Entity} from '../../entity';



export class Testdoc extends Entity {

  /**Ключ сущности*/
  keyName: string = 'idtestdoc';

  /**Наименование сущности*/
  entityName: string = 'testdoc';

  /**Загрузить из сырого объекта*/
  fromRawObject(source: any): void {
    CommonLib.copyProperty(this, source);

  }

  /**Конструктор*/
  constructor(
        /**Тест документ*/
        public idtestdoc: number,
        /**Наименование*/
        public name: string,
        /**Комментарий*/
        public comment: string,
        /**Дата создания*/
        public dtcre: Date,
        /**Дата документа*/
        public dtdoc: Date,
        /**Дата созд2*/
        public dccre2: Date,
        /**Дата2*/
        public dtdoc2: Date,
        /**Справочник*/
        public idtestdictionary: number,
        /**Справочник2*/
        public idtestdictionary2: number,
        /**Номер*/
        public numpos: number,
        /**Цена*/
        public price: number,
        /**нум 2 нот нулл*/
        public numpos2: number,
        /**Цена 2 нот нулл*/
        public price2: number,
        /**Тел.*/
        public phone: string,
        /**Об. тел.*/
        public phone2: string,
        /**email*/
        public email: string,
        /**email req*/
        public email2: string,
        /***/
        public active: boolean,
        /**Справочник*/
        public testdictionary_name: string,
        /**Справочник2*/
        public testdictionary2_name: string
  ) {
    super();
  }

  /**Получить поля с датами*/
  getFieldDate(): string[] {
      return ["dtcre","dtdoc","dccre2","dtdoc2"];
  }
}


  export class TestdocFactory extends Factory {
  /**Создать новый объект*/
  createNew(tmpId: number): IEntity {
    let varItem = new Testdoc(null, null, null, new Date(), CommonLib.getCurrentDate(), new Date(), CommonLib.getCurrentDate(), null, null, null, null, null, null, null, null, null, null, null, null, null);
    varItem.tmpId = tmpId;
    return varItem;
  }
  /**Создать пустой объект*/
  createEmpty(): IEntity {
    let varItem = new Testdoc(null, null, null, new Date(), CommonLib.getCurrentDate(), new Date(), CommonLib.getCurrentDate(), null, null, null, null, null, null, null, null, null, null, null, null, null);
    return varItem;
  }
}


