import { IEntity } from './i-entity';

/**Сущность груповая*/
export interface IGroupEntity extends IEntity {
  /**Код фильтра*/
  filter: string;
  /**Наименование*/
  name: string;
  /**Массив сущностей*/
  data: IEntity[];
  /**Порядковый номер группы*/
  numpos: number;
}
