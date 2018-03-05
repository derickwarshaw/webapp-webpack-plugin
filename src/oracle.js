const fs = require('fs');
const path = require('path');
const parseAuthor = require('parse-author');

/**
 * Reads file if it exists
 */
const readJSON = (file) => fs.existsSync(file) && JSON.parse(fs.readFileSync(file));

/**
 * Tries to find the package.json and caches its contents
 */
let _pkg;
const readPackageJson = (compilerWorkingDirectory) => _pkg = _pkg
  || readJSON(path.resolve(compilerWorkingDirectory, 'package.json'))
  || readJSON(path.resolve(compilerWorkingDirectory, '../package.json'))
  || {}
;

/**
 * Tries to guess the name from the package.json
 */
module.exports.guessAppName = (compilerWorkingDirectory) => (
  readPackageJson(compilerWorkingDirectory).name
);

/**
 * Tries to guess the description from the package.json
 */
module.exports.guessDescription = (compilerWorkingDirectory) => (
  readPackageJson(compilerWorkingDirectory).description
);

/**
 * Tries to guess the version from the package.json
 */
module.exports.guessVersion = (compilerWorkingDirectory) => (
  readPackageJson(compilerWorkingDirectory).version
);

/**
 * Tries to guess the author name from the package.json
 */
module.exports.guessDeveloperName = (compilerWorkingDirectory) => (
  parseAuthor(readPackageJson(compilerWorkingDirectory).author || "").name
);

/**
 * Tries to guess the author URL from the package.json
 */
module.exports.guessDeveloperURL = (compilerWorkingDirectory) => (
  parseAuthor(readPackageJson(compilerWorkingDirectory).author || "").url
);
