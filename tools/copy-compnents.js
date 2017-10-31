var fs = require('fs');
// var copydir = require('copy-dir');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var lib = require('./lib.js');

(function main() {

  console.log('Создание компонетов argv = ' + process.argv);

  replaceOnExists = false;

  process.argv.forEach((item) => {
    if (item == '--r') {
      replaceOnExists = true;
    }
  });

  lib.getHttp('/api/get_entity_list').then(
    (groups) => {

      //Обходим группы
      async.mapValues(groups, (value, groupName, callbackMaster) => {
        console.log(`groupName = ${groupName}`);

        // Создаем папку если нет
        let pathToGroup = 'src/app/workspace/documents/' + groupName;
        mkdirp.sync(pathToGroup);

        // Обходим сущности группы
        async.forEachLimit(groups[groupName], 10,
          (entity, callback) => {
            console.log(`entity = ${entity.name}`);

            // Получаем сущность с сервера
            lib.getHttp('/api/get_entity/' + entity.identity).then(
              (result) => {

                // Создаем нужные папки
                let pathEdit = pathToGroup + '/' + result.name + '-edit-component';
                let pathList = pathToGroup + '/' + result.name + '-list-component';
                let pathEntity = pathToGroup + '/entity';

                mkdirp.sync(pathEdit);
                mkdirp.sync(pathList);
                mkdirp.sync(pathEntity);

                let fileName = pathList + '/' + result.name + "-list-component.ts";
                if (replaceOnExists || !fs.existsSync(fileName)) {
                  fs.writeFileSync(fileName, result.ts_component_list);
                }

                fileName = pathList + '/' + result.name + "-list-component.html";
                if (replaceOnExists || !fs.existsSync(fileName)) {
                  fs.writeFileSync(fileName, result.ts_component_list_template);
                }

                fileName = pathEdit + '/' + result.name + "-edit-component.ts";
                if (replaceOnExists || !fs.existsSync(fileName)) {
                  fs.writeFileSync(fileName, result.ts_component_edit);
                }

                fileName = pathEdit + '/' + result.name + "-edit-component.html";
                if (replaceOnExists || !fs.existsSync(fileName)) {
                  fs.writeFileSync(fileName, result.ts_component_edit_template);
                }

                fileName = pathEntity + '/' + result.name + ".ts";
                if (replaceOnExists || !fs.existsSync(fileName)) {
                  fs.writeFileSync(fileName, result.ts_entity);
                }

                console.log(`entity = ${entity.name} - ok`);
                callback(null);
              },
              (error) => {
                console.log(`entity = ${entity.name} - error = ${error}`);
                callback(error);
              }
            );
          },
          (err) => {
            // Если одна из функций вернет err, то вызовется финальный колбэк без ожидания завершения остальных функций
            if (err) {
              callbackMaster(err);
            }
            else {
              // Все функции отработали
              callbackMaster(null);
            }
          });
      }, (err) => {
        // Если одна из функций вернет err, то вызовется финальный колбэк без ожидания завершения остальных функций
        if (err) {
          throw err;
        }
        else {
          console.log('Выполнено!');
        }
      });

    },
    (error) => {
      console.log(error.message);
    }
  );

})();
