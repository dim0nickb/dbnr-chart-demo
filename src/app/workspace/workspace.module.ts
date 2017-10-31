import {NgModule, LOCALE_ID} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceProviderList} from './documents/service-provider-list';
import {ServiceProvider} from './documents/service-provider';
import {ServiceProviderFilter} from './documents/service-provider-filter';
import {ServiceProviderListGroup} from './documents/service-provider-list-group';
import {AtGridModule} from 'at-grid';
import {DbnrChartModule} from 'dbnr-chart';
import {HttpModule, JsonpModule} from '@angular/http';
import {FormsModule}   from '@angular/forms';

import {MODULE_ROUTES, MODULE_COMPONENTS, MODULE_EXPORTS} from './workspace.routes';


@NgModule({
    imports: [
        BrowserModule, FormsModule,
        HttpModule, JsonpModule,
        AtGridModule,
        DbnrChartModule,
        RouterModule.forChild(MODULE_ROUTES)
    ],
    providers: [
        {provide: LOCALE_ID, useValue: navigator.language},
        ServiceProviderList,
        ServiceProvider,
        ServiceProviderFilter,
        ServiceProviderListGroup,
        // Фабрики компонетов, отключены, есть проблемы с systemjs
        /*
        {
          provide: 'PrintCount',
          useFactory: (serviceProvider: ServiceProvider) => {
            return new PrintCount(serviceProvider);
          },
          deps: [ServiceProvider]
        },
        {
          provide: 'CreateTalkScript',
          useFactory: (serviceProvider: ServiceProvider) => {
            return new CreateTalkScript(serviceProvider);
          },
          deps: [ServiceProvider]
        },
         { provide: 'PrintCount',
         useFactory:
         ()=>{
         return (serviceProvider: ServiceProvider) => {
         return new PrintCount(serviceProvider);
         }
         },
         deps: [ServiceProvider]
         }
         */
    ],
    declarations: [MODULE_COMPONENTS],
    exports: [MODULE_EXPORTS],
    entryComponents: [
        // Шаблоны динамически загружаемых компонентов
        // CustomerListComponent
    ]
})

export class WorkspaceModule {
    constructor() {
    }
}
