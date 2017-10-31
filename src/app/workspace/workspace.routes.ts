
import {Route} from '@angular/router';
import {WorkspaceComponent} from './workspace.component';
import {HomeComponent} from './dashboard/home.component';
import {PageNotFoundComponent} from './system/page-not-found-component';
import {AdDirective} from './documents/ad.directive';
import {PhoneMask} from './documents/phone-mask';
import {HideDivDirective} from './documents/hide-div-directive';
import {SafeHtml} from './documents/safe-html';

// test

export const MODULE_ROUTES: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: HomeComponent },

  // test

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

  // test

]

export const MODULE_EXPORTS = [
  WorkspaceComponent
]
