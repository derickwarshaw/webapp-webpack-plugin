const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('../src/');

const {logo, generate, compare, expected} = require('./util');

test('should work together with the html-webpack-plugin', async t => {
  const stats = await generate([
    new HtmlWebpackPlugin(),
    new WebappWebpackPlugin({logo}),
  ]);

  t.context.dist = stats.compilation.compiler.outputPath;
  const diff = await compare(t.context.dist, path.resolve(expected, 'html'));
  t.deepEqual(diff, []);
});

test.afterEach(t => fs.remove(t.context.dist));
