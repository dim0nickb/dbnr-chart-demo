import {Injectable} from '@angular/core';
import {IServiceProvider} from './i-service-provider';
import {Http, Response} from '@angular/http';
import {IEntity} from './i-entity';
import {Observable} from 'rxjs/Observable';
import {CommonLib} from './common-lib';
import {Factory} from './factory';
import {AppConfig} from '../../app.config';
/**Базовый сервис*/
@Injectable()
export class ServiceProvider implements IServiceProvider {

  constructor(public http: Http,
              public appConfig: AppConfig) {
  }

  /**Удалить сущность*/
  deleteEntity(entity: IEntity): Observable<boolean> {
    let entityUrl = this.appConfig.config.host + entity.entityName;
    return this.http.delete(entityUrl + '/' + entity[entity.keyName])
      .map((res: Response) => {
        return CommonLib.extractData(res, entity);
      })
      .catch(CommonLib.handleError);
  }

  /**Сохранить сущность*/
  postEntity(entity: IEntity): Observable<number> {
    let entityUrl = this.appConfig.config.host + entity.entityName;
    let saveData = {
      data: [entity]
    };
    return this.http.post(entityUrl, JSON.stringify(saveData),
      {headers: CommonLib.getPostHeaders()})
      .map((result: Response) => {
        return JSON.parse(result.text())
      })
      .map((result: any) => {
        if (result.result && result.result.length && result.result.length == 1) {
          return result.result[0].key_value;
        }
        else {
          console.error('Ошибка метода postEntity, не правильный ответ сервера:');
          console.error(result);
          throw new Error(`Ошибка метода postEntity, не правильный ответ сервера: ${result}`);
        }
      });
  }

  /**Получить сущность*/
  getEntity(identity: number, factory: Factory): Observable<IEntity> {
    let entityEmpty = factory.createEmpty();
    let entityUrl = this.appConfig.config.host + entityEmpty.entityName + '/' + identity;

    return this.http.get(entityUrl)
      .map((res: Response) => {
        return CommonLib.extractData(res, entityEmpty);
      })
      .map(data => {
        return data.Result.data[0];
      })
      .map(data => {
        let newEntity: IEntity = factory.createEmpty();
        newEntity.fromRawObject(data);
        return newEntity;
      })
      .catch(CommonLib.handleError);
  }

  // TODO - Убрать - перенесено в простой список
  /**Получить список для родительской сущности*/
  getEntityListForParent(parentName: string, identity: number, factory: Factory): Observable<IEntity[]> {
    let entityEmpty = factory.createEmpty();

    let entityUrl = this.appConfig.config.host + `${parentName}/${identity}/${entityEmpty.entityName}`;
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
          let newEntity: IEntity = factory.createEmpty();
          newEntity.fromRawObject(item);
          result.push(newEntity);
        }
        return result;
      })
      .catch(CommonLib.handleError);
  }
}

