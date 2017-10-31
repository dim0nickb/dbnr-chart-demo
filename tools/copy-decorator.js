var fs = require('fs');
var copydir = require('copy-dir');
var mkdirp = require('mkdirp');
var del = require('del');
var http = require('http');
var lib = require('./lib.js');
var async = require('async');

(function main() {

  console.log('Создание декораторов из шаблона');

  lib.getHttp('/api/get_entity_list').then(
    (result) => {
      try {

        async.mapValues(result,
          (entityList, groupName, cb) => {

            // Создаем папку если нет
            let pathToAction = 'src/app/workspace/documents/' + groupName + '/action';
            mkdirp.sync(pathToAction);

            // Обходим сущности группы
            async.map(entityList,
              (entity, callback) => {
                // Создаем шаблон декоратора
                let parhToDecoratorFile = pathToAction + '/' + entity.name + '-decorator.ts';
                if (!fs.existsSync(parhToDecoratorFile) /*|| true*/) {
                  // Генерим фабрику
                  fs.createReadStream('source/base-decorator.ts').pipe(fs.createWriteStream(parhToDecoratorFile));
                }

                // Получить действия для сущности
                lib.getHttp('/api/get_entity_action/' + entity.identity).then(
                  (result) => {
                    // Сохранить их в файл
                    for(let entityAction of result) {
                      let parhToEntityAction = pathToAction + '/' + entityAction.sysname + '.ts';
                      if (!fs.existsSync(parhToEntityAction)) {
                        fs.writeFileSync(parhToEntityAction, entityAction.ts_action);
                      }
                    }
                    callback(null, {'entity': entity, 'result': result});
                  },
                  (error) => {
                    callback(error, null);
                  }
                );
              },
              (error, result) => {
                // Все сущности группы обработаны, возвращаем результат
                if (error) {
                  cb(error, null);
                }
                else {
                  cb(null, result);
                }
              }
            );
          },
          (error, result_cb) => {
            if (error) {
              throw error;
            }
            else {

              let imp = '';
              let factory = ''

              console.log('Все группы обработаны');
              for (let prop in result_cb) {
                for (let e of result_cb[prop]) {
                  if (e.result.length > 0) {
                    for (let ea of e.result) {
                      imp = imp + `import {${ea.name}} from './${prop}/action/${ea.sysname}';` + '\r\n';
                      factory = factory + `      ActionFactory.dictionary['${ea.name}'] = ActionFactory.createAction(${ea.name});` + '\r\n';
                    }
                  }
                }
              }
              if (imp != '') {
                async.waterfall([
                    async.constant(imp, factory),
                    (imp, factory, callback) => {
                      // Читаем шаблон фабрики
                      fs.readFile('source/action-factory.ts', 'utf8',
                        (errReadFile, contents) => {
                          if (errReadFile) {
                            callback(errReadFile, null);
                          }
                          callback(null, imp, factory, contents);
                        });
                    },
                    (imp, factory, contents, callback) => {
                      // Репласим нужные строки
                      contents = contents.replace('/*import*/', imp);
                      contents = contents.replace('/*factory*/', factory);
                      callback(null, contents);
                    },
                    (contents, callback) => {
                      // Сохраняем шаблон фабрики
                      /*
                       fs.writeFile(
                       'src/app/workspace/documents/action-factory.ts',
                       contents,
                       (errWriteFile) => {
                       if(errWriteFile) {
                       callback(errWriteFile);
                       }
                       else {
                       callback(null, 'OK');
                       }
                       }
                       );
                       */
                      // Не генерим фабрику из-за зависимостей действий от не понятных сервисов
                      // !!!!!
                      callback(null, 'OK');
                    }
                  ],
                  function (error, results) {
                    if (error) {
                      console.log('end error = ' + error);
                    }
                    else {
                      console.log('end results = ' + results);
                    }
                  }
                );// Конец водопада
              }// if(imp != '')

              // Фабрики компонент
              let importText = '';
              let editText = '';
              let listText = '';
              for (let groupName in result) {
                editText += '  \/\/ ' + groupName + '\n';
                listText += '  \/\/ ' + groupName + '\n';
                importText += '\/\/ ' + groupName + '\n';
                for (let entity of result[groupName]) {
                  let entityName = entity.name;
                  // importText += `import {${toTitleCase(entityName)}EditComponent} from './${groupName}/${entityName}-edit-component/${entityName}-edit-component';${'\n'}`;
                  importText += `import {${toTitleCase(entityName)}ListComponent} from './${groupName}/${entityName}-list-component/${entityName}-list-component';${'\n'}`;
                  // editText += `  '${toTitleCase(entityName)}EditComponent': ${toTitleCase(entityName)}EditComponent,${'\n'}`;
                  listText += `  '${toTitleCase(entityName)}ListComponent': ${toTitleCase(entityName)}ListComponent,${'\n'}`;
                }
              }

              listText = listText.replace(/,\n$/m, '');

              let factoryText = `
import {CommonComponent} from './common-component';
import {Type} from '@angular/core';
import {ListComponent} from './list';
${importText}

/**Констркуторы всех компонент*/
var ctorsComponent: { [componentName: string]: Type<CommonComponent> } = {
${editText}
${listText}
}

/**Конструкторы списочных компонент*/
var ctorsListComponent: { [componentName: string]: Type<ListComponent> } = {
${listText}
}

/**Получить конструктор компонента, если нет, то null*/
export function getConstructorComponent(componentName: string): Type<CommonComponent> {
  return ctorsComponent[componentName];
}

/**Получить конструктор списочного компонента, если нет, то null*/
export function getConstructorListComponent(componentName: string): Type<ListComponent> {
  return ctorsListComponent[componentName];
}
`;
              //console.log(factoryText);
              // Сохраняем шаблон фабрики
              fs.writeFile('src/app/workspace/documents/factory-component.ts', factoryText,
                (errWriteFile) => {
                  if (errWriteFile) {
                    console.error('factory-component - error');
                  }
                  else {
                    console.log('factory-component - OK');
                  }
                }
              );

            }// Нет ошибки
          }// callback финальный
        );

      } catch (e) {
        console.error(e.message);
      }
    },
    (error) => {
      console.log(error.message);
    });
})();

/**Сделать с заглавной буквы*/
function toTitleCase(str) {
  return str.replace(/\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
