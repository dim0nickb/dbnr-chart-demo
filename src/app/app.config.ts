import {Inject, Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

/**Конфиг приложения*/
@Injectable()
export class AppConfig {

  /**Конфиг*/
  public config: {
    host: string
  } = null;

  /**Конфигурация окружения*/
  private env: {
    env: string
  } = null;

  /**Конструктор*/
  constructor(private http: Http) {
  }

  /**Загрузить конфигурацию окружения, потом загрузить сам конфиг*/
  public load() {
    return new Promise((resolve, reject) => {

      // Загрузить конфигурацию окружения
      this.http.get('env.json')
        .map(res => res.json())
        .catch((error: any): any => {
          console.error('Конфигурационный файл "env.json" не может быть прочитан');
          resolve(true);
          return Observable.throw(error || 'Ошибка сервера');
        })
        .subscribe((envResponse) => {

          // Сохраняем конфиг окружения
          this.env = envResponse as { env: string };
          let request: Observable<Response> = null;

          // Анализируем тип конфига
          if (this.env.env === 'production') {
            request = this.http.get(`config.${this.env.env}.json`);
          } else if (this.env.env === 'development') {
            request = this.http.get(`config.${this.env.env}.json`);
          } else {
            console.error('Файл окружения настроен не правильно!');
            resolve(true);
          }

          // Загружаем нужный конфиг
          if (request != null) {
            request
              .map(res => res.json())
              .catch((error: any) => {
                console.error(`Ошибка чтения конфигурационного файла: ${this.env.env}`);
                resolve(error);
                return Observable.throw(error || 'Server error');
              })
              .subscribe((responseData) => {
                this.config = responseData;
                console.log(`Загружена конфигурация ${this.env.env}`);
                resolve(true);
              });
          } else {
            console.error('Env config file "env.json" is not valid');
            resolve(true);
          }
        });
    });
  }
}
