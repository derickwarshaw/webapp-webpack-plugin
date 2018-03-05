const {parseQuery, interpolateName} = require('loader-utils');
const favicons = require('favicons');

module.exports = function (content) {
  if (!this.emitFile) throw new Error('emitFile is required');
  if (!this.async) throw new Error('async is required');

  const callback = this.async();
  const {prefix, params, context, regExp} = parseQuery(this.query);
  const path = interpolateName(this, prefix, {
    context: context || (this.options && this.options.context) || this.rootContext,
    regExp,
    content,
  });

  // Generate icons
  generateIcons(this, content, path, params, callback);
};

const getPublicPath = ({outputOptions: {publicPath = ''}}) => (
  (publicPath.length && publicPath.substr(-1) !== '/') ? publicPath + '/' : publicPath
);

const generateIcons = (loader, source, path, params, callback) => {
  const publicPath = getPublicPath(loader._compilation);
  params.url = params.url || '';
  params.path = params.path || '';
  favicons(source, params, (err, {images = [], files = [], html = []} = {}) => {
    if (err) {
      return callback(err);
    }

    [...images, ...files].forEach(({name, contents}) => loader.emitFile(path + name, contents));

    const result = html.map((entry) => entry.replace(/(href=['"])/g, '$1' + publicPath + path));
    return callback(null, 'module.exports = ' + JSON.stringify(result));
  });
};

module.exports.raw = true;
