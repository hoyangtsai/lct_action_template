const fs = require('fs');
const path = require('path');
const vue = require('rollup-plugin-vue');
const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const postcssConfig = require('../postcss.config.js');

const copyTemplate = require('./helper/copyTemplate.js');
const templEntryPath = path.resolve(__dirname, 'template/entry.js');

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
  // input: 'src/entry.js',
  plugins: {
    preVue: [
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.css'],
        entries: {
          '@': path.resolve(projectRoot),
          fitTheme: path.resolve(projectRoot, 'fit_ui/src/themes/default'),
        },
      }),
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.ES_BUILD': JSON.stringify('false'),
    },
    vue: {
      css: true,
      style: {
        postcssOptions: postcssConfig,
        postcssPlugins: [
          ...postcssConfig.plugins,
        ],
      },
      template: {
        isProduction: true,
      },
    },
    babel: {
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  'vue',
  'html2canvas',
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: 'Vue',
  html2canvas: 'html2canvas',
};

const unpkgConfig = {
  ...baseConfig,
  external,
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    babel(baseConfig.plugins.babel),
    commonjs(),
    nodeResolve(),
    terser({
      output: {
        ecma: 5,
      },
    }),
  ],
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function outputConfig(file) {
  const componentDirPath =  path.dirname(file);

  const componentBase = path.basename(file, '.vue');
  const componentName = componentBase.split('-').map(s => s.capitalize())
    .join('');

  if (fs.existsSync(file)) {
    copyTemplate(
      componentDirPath, // output dir
      'index.js', // output file name
      templEntryPath, // template file path
      [
        {
          match: /{{=ComponentName}}/g,
          replace: componentName,
        },
        { 
          match: /{{=ComponentPath}}/g,
          replace: `./${componentBase}.vue`,
        },
        {
          match: /{{=ComponentTagName}}/g,
          replace: `${componentName}.name`,
        },
      ],
    );
  }

  const entryFile = `${componentDirPath}/index.js`;

  if (fs.existsSync(entryFile)) {
    const conf = { ...unpkgConfig, ...{
      input: entryFile,
      output: {
        file: `inc/js/${componentBase}.umd.js`,
        name: componentName,
        compact: false,
        format: 'umd',
        exports: 'named',
        globals,
      },
    } };

    return conf;
  }

  return;
}

// Export config
module.exports = outputConfig;
