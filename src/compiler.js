const path = require('path');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const {tap, tapAsync} = require('./util.js');

module.exports.run = ({prefix, favicons: params, logo}, context, compilation) => {
  // The entry file is just an empty helper as the dynamic template
  // require is added in "loader.js"
  const filename = logo;
  const publicPath = compilation.outputOptions.publicPath;

  // Create an additional child compiler which takes the template
  // and turns it into an Node.JS html factory.
  // This allows us to use loaders during the compilation
  const compiler = compilation.createChildCompiler('webapp-webpack-plugin', {filename, publicPath});
  compiler.context = context;

  const loader = require.resolve('./favicons.js');
  const query = JSON.stringify({prefix, params});
  new SingleEntryPlugin(context, `!!${loader}?${query}!${logo}`).apply(compiler);

  // Compile and return a promise
  return new Promise((resolve, reject) => {
    compiler.runAsChild((err, _, childCompilation = {}) => {
      if (err) {
        return reject(err);
      }

      const {errors = [], assets = {}} = childCompilation;
      childCompilation.assets = {}; // avoid duplicated output

      if (errors.length) {
        const details = errors.map(({message, error}) => message + (error ? ':\n' + error : '')).join('\n');
        return reject(new Error('Child compilation failed:\n' + details));
      }

      try {
        delete compilation.assets[filename];
        return resolve(eval(assets[filename].source()));
      } catch (e) {
        return reject(e);
      }
    });
  });
};
