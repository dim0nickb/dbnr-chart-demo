
import {Injectable} from '@angular/core';
import {ServiceProvider} from './service-provider';
import {IServiceProviderFilter} from './i-service-provider-filter';
import {Http, Response} from '@angular/http';
import {Factory} from './factory';
import {Observable} from 'rxjs/Observable';
import {IEntity} from './i-entity';
import {CommonLib} from './common-lib';
import {AppConfig} from '../../app.config';

/**Сервис для фильтра*/
@Injectable()
export class ServiceProviderFilter extends ServiceProvider
  implements IServiceProviderFilter {

  constructor (http: Http,
               appConfig: AppConfig) {
    super(http, appConfig);
  }

  /**Получить список из фильтра*/
  getEntityList(idfilter: number, factory: Factory): Observable<IEntity[]> {
    let entityEmpty = factory.createEmpty();
    let entityUrl = this.appConfig.config.host + entityEmpty.entityName;
      return this.http.get(entityUrl + '/filter/' + idfilter)
        .map((res: Response) => { return CommonLib.extractData(res, entityEmpty); })
        .map(data => {
          return data.Result.data;
        })
        .map(data => {
          let result = [];
          for (let item of data) {
            let newEntity: IEntity = factory.createEmpty();
            newEntity.fromRawObject(item);
            result.push(newEntity);
          }
          return result;
        })
        .catch(CommonLib.handleError);
  }
}
