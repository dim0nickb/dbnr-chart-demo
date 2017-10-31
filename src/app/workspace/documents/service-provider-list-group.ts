
import {Injectable} from '@angular/core';
import {ServiceProviderList} from './service-provider-list';
import {IServiceProviderList} from './i-service-provider-list';
import {Http, Response} from '@angular/http';
import {FactoryGroup} from './factory-group';
import {Observable} from 'rxjs/Observable';
import {CommonLib} from './common-lib';
import {IGroupEntity} from './i-group-entity';
import {AppConfig} from '../../app.config';

/**Возвращаает список фильтров*/
@Injectable()
export class ServiceProviderListGroup extends ServiceProviderList
  implements IServiceProviderList {

  constructor(http: Http,
              appConfig: AppConfig) {
    super(http, appConfig);
  }

  /**Получить список*/
  getEntityGroupList(factory: FactoryGroup): Observable<IGroupEntity[]> {
    let entityEmpty = factory.createEmpty();

    let entityUrl = this.appConfig.config.host + entityEmpty.entityName;

    return this.http.get(entityUrl)
      .map((res: Response) => {
        return CommonLib.extractData(res, entityEmpty);
      })
      .map(data => {
        return data.Result.data;
      })
      .map(data => {

        let result = [];
        for (let item of data) {
          let newEntity: IGroupEntity = factory.createEmptyGroup();
          newEntity.fromRawObject(item);
          result.push(newEntity);
        }
        return result;
      })
      .map(data => {
        data.sort((a, b) => {
          let aNumpos = a.numpos == null ? 0 : a.numpos;
          let bNumpos = b.numpos == null ? 0 : b.numpos;
          return aNumpos - bNumpos;
        });
        return data;
      })
      .catch(CommonLib.handleError);
  }
}
