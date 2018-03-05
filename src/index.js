const assert = require('assert');
const childCompiler = require('./compiler.js');
const oracle = require('./oracle.js');
const {tap, tapAsync} = require('./util.js');

module.exports = class WebappWebpackPlugin {
  constructor (args) {
    const options = (typeof args === 'string') ? {logo: args} : args;
    assert(typeof options === 'object' && typeof options.logo === 'string', 'An input file is required');

    this.options = Object.assign({
      prefix: 'assets-[hash]/',
      favicons: {},
      inject: true,
    }, options);
  }

  apply(compiler) {
    const {
      appName = oracle.guessAppName(compiler.context),
      appDescription = oracle.guessDescription(compiler.context),
      version = oracle.guessVersion(compiler.context),
      developerName = oracle.guessDeveloperName(compiler.context),
      developerURL = oracle.guessDeveloperURL(compiler.context),
    } = this.options.favicons;

    Object.assign(this.options.favicons, {
      appName,
      appDescription,
      version,
      developerName,
      developerURL,
    });

    tap(compiler, 'compilation', 'WebappWebpackPlugin', () => {
      tapAsync(compiler, 'make', 'WebappWebpackPlugin', async (compilation, callback) => {
        try {
          // Generate favicons
          const result = await childCompiler.run(this.options, compiler.context, compilation);

          if (this.options.inject) {
            // Hook into the html-webpack-plugin processing and add the html
            tap(compilation, 'html-webpack-plugin-before-html-processing', 'WebappWebpackPluginInjection', (htmlPluginData) => {
              if (htmlPluginData.plugin.options.favicons !== false) {
                htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, result.sort().join('') + '$&');
              }
              return htmlPluginData;
            });
          }

          return callback();
        } catch (e) {
          return callback(e);
        }
      });
    });
  }
}
