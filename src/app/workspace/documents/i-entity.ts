/**Сущность*/
export interface IEntity {
  /**Ключ сущности*/
  keyName: string;

  /**Наименование сущности*/
  entityName: string;

  /**Временный ключ*/
  tmpId: number;

  /**Загрузить из сырого объекта*/
  fromRawObject(source: any): void;

  /**Присваевание сущностей*/
  assign(source: IEntity): void;

  /**Сравнение сущностей*/
  equals(source: IEntity): boolean;

  /**Получить поля с датами*/
  getFieldDate(): string[];
}
