import {IServiceProvider} from './i-service-provider';
import {Factory} from './factory';
import {Observable} from 'rxjs/Observable';
import {IEntity} from './i-entity';
/**Список с фильтром*/
export interface IServiceProviderFilter extends IServiceProvider {
  /**Получить список из фильтра*/
  getEntityList(idfiltergroup: number, factory: Factory): Observable<IEntity[]>;
}
