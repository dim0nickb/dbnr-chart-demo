import {IEntity} from './i-entity';
import {Observable} from 'rxjs/Observable';
import {Factory} from './factory';
/**Базовый интерфей сервиса*/
export interface IServiceProvider {
  /**Удалить сущность*/
  deleteEntity(entity: IEntity): Observable<boolean>;
  /**Получить сущность*/
  getEntity(identity: number, factory: Factory): Observable<IEntity>;
  /**Сохранить сущность*/
  postEntity(entity: IEntity): Observable<number>;
}
