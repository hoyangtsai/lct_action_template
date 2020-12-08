const through2 = require('through2');  
const rollup = require('rollup');
const rollupConfig = require('./rollup.config');
const path = require('path');
const md5File = require('md5-file');
const fs = require('fs');

const fileMeta = {};

async function outputEntry(filePath, fileMeta) {
  const config = rollupConfig(filePath);
  try {
    // create a bundle
    const bundle = await rollup.rollup(config);
    // write the bundle to disk
    const outputOptions = {
      output: { ...config.output },
      external: { ...config.external },
      plugins: { ...config.plugins },
    };
    await bundle.write(outputOptions);
    const fileBase = path.basename(filePath, '.vue');
    const hash = md5File.sync(filePath);
    fileMeta[fileBase].md5 = hash; 
  } catch (error) {
    console.log('outputEntry error =>', error);
  }
}

module.exports = function () {  
  return through2.obj(async function (file, encoding, callback) {
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    if (file.isNull() || file.isDirectory()) {
      callback(null, file);
    }
    // get component file name without extension
    const fileBase = path.basename(file.path, '.vue');
    // create file meta cache
    if (!fileMeta[fileBase]) {
      fileMeta[fileBase] = {
        md5: '',
        requireBy: [],
      };
    }
    // get component path
    const fileDir = path.dirname(file.path);
    // read component file content in order to get import components
    const fileContent = fs.readFileSync(file.path, 'utf8');
    const importRegex = /import\s+(\w+)\s+from\s+.+(\/.*)(?=\/index)/gmi;
    const imports = fileContent.match(importRegex) || [];
    // record each import
    await imports.forEach((imp) => {
      // chop import path and ensure starting with one or two dot to avoid getting node_modules as import components
      const matches = /from.*('|")(\.{1,2}|@)(.+)/.exec(imp);
      
      if (matches.length > 0) {
        const cname = matches[2];
        const dep = path.resolve(fileDir, cname);
        const depBase = path.basename(dep);

        if (!fileMeta[depBase]) {
          fileMeta[depBase] = {
            md5: '',
            requireBy: [`${file.path}`],
          };
        } else if (fileMeta[depBase].requireBy.indexOf(file.path) < 0) {
          fileMeta[depBase].requireBy = [
            ...fileMeta[depBase].requireBy, 
            `${file.path}`,
          ];
        }
      }
    });

    // read current component md5
    const hash = md5File.sync(file.path);

    // not compile yet
    if (!fileMeta[fileBase].md5) {
      await outputEntry(file.path, fileMeta);
      callback(null, file);
    } else if (fileMeta[fileBase].md5 !== hash) { // if md5 differenct from the last compile
      await outputEntry(file.path, fileMeta);
      callback(null, file);

      if (fileMeta[fileBase].requireBy) { // also compile its parents
        fileMeta[fileBase].requireBy.forEach((r) => {
          outputEntry(r, fileMeta);
        });
      }
    } else {
      callback(null, file);
    }
  });
};
