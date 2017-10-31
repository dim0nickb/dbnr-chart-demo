import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {AppConfig} from './app.config';

import {NavbarModule} from './navbar/navbar.module';
import {SidebarModule} from './sidebar/sidebar.module';
import {WorkspaceModule} from './workspace/workspace.module';

@NgModule({
  imports:
    [
      BrowserModule,
      FormsModule,
      NavbarModule,
      SidebarModule,
      WorkspaceModule,
      RouterModule.forRoot([], { enableTracing: false })
    ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    }
  ],
  declarations:
    [
      AppComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

  constructor() {
  }
}

export function initConfig(config: AppConfig) {
  return () => config.load();
}
