import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Setting} from './setting';
import {AppModule} from './app/app.module';

// Для JIT не ключаем продакшен режим
// enableProdMode();
Setting.initApplication();
platformBrowserDynamic().bootstrapModule(AppModule);
