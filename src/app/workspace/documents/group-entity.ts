import {Entity} from './entity';
import { IGroupEntity } from './i-group-entity';
import { IEntity } from './i-entity';

/**Сущность груповая*/
export class GroupEntity extends Entity implements IGroupEntity {
  /**Код фильтра*/
  filter: string;
  /**Наименование*/
  name: string;
  /**Массив сущностей*/
  data: IEntity[] = [];
  /**Порядковый номер группы*/
  numpos: number;
}
