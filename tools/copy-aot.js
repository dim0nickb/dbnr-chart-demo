var fs = require('fs');
var copydir = require('copy-dir');
var mkdirp = require('mkdirp');

var resources = [
  {
    'source': 'node_modules/core-js/client/shim.min.js'
  },
  {
    'source': 'node_modules/zone.js/dist/zone.min.js'
  },
  {
    'source': 'node_modules/jquery/dist/jquery.js'
  },
  {
    'source': 'assets/js/core/bootstrap.min.js'
  },
  {
    'source': 'source/loader-preview.svg',
    'dest': 'source/loader-preview.svg'
  },
  {
    'source': 'source/favicon.ico'
  },
  {
    'source': '.htaccess'
  },
  {
    'source': 'env.json'
  },
  {
    'source': 'config.production.json'
  },
  {
    'source': 'config.development.json'
  },
  {
    'source': 'source/index-aot.html',
    'dest': 'index.html'
  },
];

function main() {

  mkdirp('dist/aot', function(err) {
    // path exists unless there was an error
  });
  mkdirp('dist/aot/source', function(err) {
    // path exists unless there was an error
  });

  resources.map((f) => {
    // Папка с билдом
    let path_dest = 'dist/aot/';
    // Сплитим путь для получении имени файла
    let path = f.source.split('/');
    // Файл назначения, если не указано имя файла остается без изменений
    let dest = f.dest == null ? path_dest + path[path.length - 1] : path_dest + f.dest;
    fs.createReadStream(f.source).pipe(fs.createWriteStream(dest));
  });

  copydir('assets', 'dist/aot',
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('ok');
      }
    }
  );
};

new main();
