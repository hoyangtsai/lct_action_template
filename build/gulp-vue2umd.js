const through2 = require('through2');  
const rollup = require('rollup');
const rollupConfig = require('./rollup.config');
const path = require('path');
const md5File = require('md5-file');
const fs = require('fs');

let fileMeta = {};

async function outputEntry(filePath, fileMeta) {
  const config = rollupConfig(filePath);
  try {
    // create a bundle
    const bundle = await rollup.rollup(config);
    // write the bundle to disk
    const outputOptions = {
      output: { ...config.output },
      external: { ...config.external },
      plugins: { ...config.plugins }
    };
    await bundle.write(outputOptions);
    const fileBase = path.basename(filePath, '.vue');
    const hash = md5File.sync(filePath);
    fileMeta[fileBase].md5 = hash; 
  } catch (error) {
    console.log('outputEntry error =>', error);
  }
}

module.exports = function() {  
  return through2.obj(async function(file, encoding, callback) {
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    if (file.isNull() || file.isDirectory()) {
      callback(null, file);
    }
    const fileBase = path.basename(file.path, '.vue');

    if (!fileMeta[fileBase]) {
      fileMeta[fileBase] = {
        md5: '',
        requireBy: [],
      };
    }

    const fileDir = path.dirname(file.path);

    const fileContent = fs.readFileSync(file.path, 'utf8');
    const importRegex = /import\s+(\w+)\s+from\s+.+(\/.*)(?=\/index)/gmi;
    const imports = fileContent.match(importRegex) || [];

    await imports.forEach((imp) => {
      const matches = /from.*('|")\.{1,2}(.+)/.exec(imp);
      
      if (matches.length > 0) {
        const cname = matches[2];
        const dep = path.resolve(fileDir, cname);
        const depBase = path.basename(dep);

        if (!fileMeta[depBase]) {
          fileMeta[depBase] = {
            md5: '',
            requireBy: [`${file.path}`]
          }
        } else if (fileMeta[depBase].requireBy.indexOf(file.path) < 0) {
          fileMeta[depBase].requireBy =
            [...fileMeta[depBase].requireBy, `${file.path}`];
        }
      }
    });

    const hash = md5File.sync(file.path);

    if (!fileMeta[fileBase].md5) {
      await outputEntry(file.path, fileMeta);
      callback(null, file);
    } else if (fileMeta[fileBase].md5 !== hash) {
      await outputEntry(file.path, fileMeta);
      callback(null, file);

      if (fileMeta[fileBase].requireBy) {
        fileMeta[fileBase].requireBy.forEach((r) => {
          console.log('r =>', r);
          outputEntry(r, fileMeta);
        });
      }
    } else {
      callback(null, file);
    }
  });
};