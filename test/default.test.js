const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const WebappWebpackPlugin = require('../src/');

const {logo, generate, compare, expected} = require('./util');

test('should generate the expected default result', async t => {
  const stats = await generate([new WebappWebpackPlugin({logo})]);

  t.context.dist = stats.compilation.compiler.outputPath;
  const diff = await compare(t.context.dist, path.resolve(expected, 'default'));
  t.deepEqual(diff, []);
});

test.afterEach(t => fs.remove(t.context.dist));
