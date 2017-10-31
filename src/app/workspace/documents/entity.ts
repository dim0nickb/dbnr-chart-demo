import {IEntity} from './i-entity';
import { CommonLib } from './common-lib';

/**Сущность*/
export class Entity implements IEntity {
  /**Ключ сущности*/
  keyName: string;

  /**Наименование сущности*/
  entityName: string;

  /**Временный ключ*/
  tmpId: number;

  /**Загрузить из сырого объекта*/
  fromRawObject(source: any): void {
    throw new Error('fromRawObject not implemented');
  }

  /**Присваевание сущностей*/
  assign(source: Entity): void {
    CommonLib.assign(this, source);
  }

  /**Сравнение сущностей*/
  equals(source: IEntity): boolean {
    if (this[this.keyName] != null
      && this[this.keyName] === source[source.keyName]) {
      return true;
    }
    if (this.tmpId != null && this.tmpId === source.tmpId) {
      return true;
    }
    return false;
  }

  /**Получить поля с датами*/
  getFieldDate(): string[] {
    return new Array<string>();
  }
}
