import { Factory } from './factory';
import { IGroupEntity } from './i-group-entity';
import { GroupEntity } from './group-entity';
/**Фабрика*/
export class FactoryGroup extends Factory {

  /**Создать новый объект*/
  createNewGroup(tmpId: number): IGroupEntity {
    let e = new GroupEntity();
    e.tmpId = tmpId;
    return e;
  }

  /**Создать пустой объект*/
  createEmptyGroup(): IGroupEntity {
    return new GroupEntity();
  }
}
