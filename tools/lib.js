var http = require('http');

function main() {
}

/**Запрос к нашему бэк энду*/
main.prototype.getHttp = function(path, propName) {
  let promise = new Promise(function (resolve, reject) {
    // Получить сущность
    let options = {
      hostname: 'localhost',
      port: 3003,
      path: path,
      agent: false  // create a new agent just for this one request
    };

    http.get(options, (res) => {
      // res - http.IncomingMessage
      const {statusCode} = res;
      // Тип ответа
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Ошибка запроса Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Не правильный content-type. Ожидается application/json получен: ${contentType}`);
      }
      if (error) {
        res.resume();
        reject(error);
        return;
      }

      // Извлекаем данные
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          let data;
          if(propName == null) {
            data = parsedData.data;
          }
          else {
            data = parsedData[propName];
          }

          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });

  return promise;
}

module.exports = new main();