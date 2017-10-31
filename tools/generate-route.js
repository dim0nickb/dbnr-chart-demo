/**
 * Created by Николай on 26.09.2017.
 */
var fs = require('fs');
var lib = require('./lib.js');
const Rx = require('rxjs/Rx');

(async function main() {
  console.log('generate-route -> start');

  let observable = Rx.Observable.fromPromise(lib.getHttp('/api/get_entity_list'));

  observable
    .switchMap(async (result) => {
      let script = '';

      let importStr = '';
      let routeStr = '';
      let listStr = '';

      for (let group in result) {
        console.log(`group = ${group}`);
        importStr += `// ${group}` + '\n';
        routeStr += `  // ${group}` + '\n';
        listStr += `  // ${group}` + '\n';
        for (let entity of result[group]) {
          console.log(` -> ${JSON.stringify(entity)}`);

          // Импорт компонент
          importStr += `import {${upperCaseFirstLetter(entity.name)}ListComponent} from './documents/${group}/${entity.name}-list-component/${entity.name}-list-component';` + '\n';
          importStr += `import {${upperCaseFirstLetter(entity.name)}EditComponent} from './documents/${group}/${entity.name}-edit-component/${entity.name}-edit-component';` + '\n';

          // Маршрут к списку
          routeStr += `  { path: 'documents/${entity.name}', component:  ${upperCaseFirstLetter(entity.name)}ListComponent },` + '\n';

          let entitySlave = await lib.getHttp(`/api/get_entity_slave/${entity.identity}`, 'Result');
          let childrenStr = '';
          if(entitySlave.data.length > 0) {
            childrenStr = `,
    children: [`
            for (let entity_slave of entitySlave.data) {
              childrenStr += `
      {path: '${entity_slave.name}/:idfilterentity/:filter', component: ${upperCaseFirstLetter(entity_slave.name)}ListComponent, outlet: 'ro_${entity_slave.name}'},`
            }

            childrenStr += `
    ]`;
          }

          // Маршрут к редактированию сущности
          routeStr += `  { path: 'documents/${entity.name}/edit/:id${entity.name}', component:  ${upperCaseFirstLetter(entity.name)}EditComponent${childrenStr} },` + '\n';
          // Маршрут к новой сущности
          routeStr += `  { path: 'documents/${entity.name}/new', component:  ${upperCaseFirstLetter(entity.name)}EditComponent${childrenStr}},` + '\n';

          // Списки компонентов
          listStr += `  ${upperCaseFirstLetter(entity.name)}ListComponent,` + '\n';
          listStr += `  ${upperCaseFirstLetter(entity.name)}EditComponent,` + '\n';
        }
      }

      //console.log(importStr);
      //console.log(routeStr);
      //console.log(listStr);

      script = `
import {Route} from '@angular/router';
import {WorkspaceComponent} from './workspace.component';
import {HomeComponent} from './dashboard/home.component';
import {PageNotFoundComponent} from './system/page-not-found-component';
import {AdDirective} from './documents/ad.directive';
import {PhoneMask} from './documents/phone-mask';
import {HideDivDirective} from './documents/hide-div-directive';
import {SafeHtml} from './documents/safe-html';

import {SettingComponent} from './documents/setting/setting-component/setting-component';
import {REComponent} from './documents/report/r-e-component/r-e-component';
import {RLComponent} from './documents/report/r-l-component/r-l-component';
import {ReportViewComponent} from './documents/report/report-view-component/report-view-component'

${importStr}

export const MODULE_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: HomeComponent },
  { path: 'documents/settings', component: SettingComponent },

${routeStr}

  // Ошибка поиска маршрута
  { path: '**', component: PageNotFoundComponent },

]

export const MODULE_COMPONENTS = [
  AdDirective,
  PhoneMask,
  HideDivDirective,
  SafeHtml,
  WorkspaceComponent,
  HomeComponent,
  PageNotFoundComponent,

  SettingComponent,
  REComponent,
  RLComponent,
  ReportViewComponent,

${listStr}
]

export const MODULE_EXPORTS = [
  WorkspaceComponent
]

      `;

      return script;
    })
    .map(
      (result) => {
        fs.writeFileSync('src/app/workspace/workspace.routes.ts', result);
        //fs.writeFileSync('workspace.routes.ts', result);
        return 'Ok';
      }
    )
    .subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.error(error);
      },
      () => {
        console.log('Выполнено!');
      }
    );

})();


function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('resolve');
    }, 2000);
  });
}
