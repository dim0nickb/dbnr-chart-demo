import {IServiceProvider} from './i-service-provider';
import {Factory} from './factory';
import {Observable} from 'rxjs/Observable';
import {IEntity} from './i-entity';
/**Классичесие список*/
export interface IServiceProviderList extends IServiceProvider {
  getEntityList(factory: Factory): Observable<IEntity[]>;
  getEntityListForParent(parentName: string, identity: number, factory: Factory): Observable<IEntity[]>;
}
