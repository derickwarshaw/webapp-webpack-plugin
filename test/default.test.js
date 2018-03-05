import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import WebappWebpackPlugin from '../src/';

import {logo, generate, compare, expected} from './util';

test('should generate the expected default result', async t => {
  const stats = await generate([new WebappWebpackPlugin({logo})]);

  t.context.dist = stats.compilation.compiler.outputPath;
  const diff = await compare(t.context.dist, path.resolve(expected, 'default'));
  t.deepEqual(diff, []);
});

test.afterEach(t => fs.remove(t.context.dist));
