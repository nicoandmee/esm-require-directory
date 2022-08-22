// eslint-disable-next-line import/extensions
import walk from './walk.js';
import importFile from './importFile.mjs';

var EXTENSIONS = ['.mjs', '.js', '.scene.js'];

export default function importDirectory(directory, options, callback) {
  /* eslint-disable */
  if (arguments.length === 2 && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // choose between promise and callback API
  if (typeof callback === 'function') {
    options = options || {};
    options = {
      recursive: options.recursive,
      paths: options.paths,
      filename: options.filename,
      default: options.default === undefined ? true : options.default,
      extensions: options.extensions || EXTENSIONS,
      loader: options.loader || importFile,
    };
    options.extensions.map(function (extension) {
      if (!~EXTENSIONS.indexOf(extension)) throw new Error('Extension not supported: ' + extension);
    });
    if (options.paths && options.filename === undefined) options.filename = true;

    walk(directory, options, callback);
  } else {
    return new Promise(function (resolve, reject) {
      importDirectory(directory, options, function (err, results) {
        err ? reject(err) : resolve(results);
      });
    });
  }
}
