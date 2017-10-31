import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";

/***/
@Component({
  moduleId: module.id,
  selector: 'workspace-cmp',
  templateUrl: 'workspace.component.html'
})
export class WorkspaceComponent {

  /**Лог роутинга*/
  public static log = new Array<string>();

  /**Конструктор*/
  constructor(public location: Location,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
  }

  /**Активация маршрута*/
  onActivateMasterRoute(form: any) {
    WorkspaceComponent.log.push(this.router.url);
    if (WorkspaceComponent.log.length > 10) {
      WorkspaceComponent.log.splice(1);
    }
  }

  /**Получить предыдущий урл*/
  public static getPrevUrl(): string {
    if (WorkspaceComponent.log.length == 1) {
      WorkspaceComponent.log.pop();
      return '/dashboard';
    }
    else if (WorkspaceComponent.log.length == 0) {
      return '/dashboard';
    }
    else {
      WorkspaceComponent.log.pop();
      return WorkspaceComponent.log.pop();
    }
  }
}
