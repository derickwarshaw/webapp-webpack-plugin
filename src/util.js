const camelCase = require('camelcase');

const plug = (tap, tappable, hook, name, plugin) => {
  if (tappable.hooks) /* Webpack >= 4.0 */ {
    if (tappable.hooks[camelCase(hook)]) {
      return tappable.hooks[camelCase(hook)][tap](name, plugin);
    }
  } else {
    return tappable.plugin(hook, plugin);
  }
};

module.exports.tap = (tappable, hook, name, plugin) => (
  plug('tap', tappable, hook, name, plugin)
);

module.exports.tapAsync = (tappable, hook, name, plugin) => (
  plug('tapAsync', tappable, hook, name, plugin)
);
