import {enableProdMode} from '@angular/core';
import {platformBrowser}    from '@angular/platform-browser';
import {Setting} from './setting';
import {AppModuleNgFactory} from '../tmp/aot/src/app/app.module.ngfactory';

enableProdMode();
Setting.initApplication();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
