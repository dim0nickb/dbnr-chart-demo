import { IEntity } from './i-entity';
import { Entity } from './entity';
/**Фабрика*/
export class Factory {

  /**Создать новый объект*/
  createNew(tmpId: number): IEntity {
    let e = new Entity();
    e.tmpId = tmpId;
    return e;
  }

  /**Создать пустой объект*/
  createEmpty(): IEntity {
    return new Entity();
  }
}
