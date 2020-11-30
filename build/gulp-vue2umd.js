const through = require('through2');  
const rollup = require('rollup');
const rollupConfig = require('./rollup.config');
const path = require('path');
const md5File = require('md5-file');
let fileCaches = {};

async function outputEntry(file) {
  const filePath = file.path;
  const config = rollupConfig(filePath);
  // create a bundle
  const bundle = await rollup.rollup(config);
  // write the bundle to disk
  const outputOptions = {
    output: { ...config.output },
    external: { ...config.external },
    plugins: { ...config.plugins }
  };
  await bundle.write(outputOptions);
  const fileBase = path.basename(file.path);
  const hash = md5File.sync(file.path);
  fileCaches[fileBase] = hash;
}

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    if (file.isNull() || file.isDirectory()) {
      callback(null, file);
    }
    const fileBase = path.basename(file.path);
    const hash = md5File.sync(file.path);
    if (fileBase in fileCaches && fileCaches[fileBase] === hash) {
      callback(null, file);
    } else if (file.isBuffer()) {
      callback(null, outputEntry(file));
    }
  });
};