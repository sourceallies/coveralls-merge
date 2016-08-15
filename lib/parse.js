'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _parseLcov = require('./parse/parse-lcov');

var _parseLcov2 = _interopRequireDefault(_parseLcov);

var _parseJacoco = require('./parse/parse-jacoco');

var _parseJacoco2 = _interopRequireDefault(_parseJacoco);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reports = {
    lcov: _parseLcov2.default,
    jacoco: _parseJacoco2.default
};

function resolveWorkingDirectory(workingDirectory) {
    if (workingDirectory) {
        return _path2.default.resolve(process.cwd(), workingDirectory);
    }

    return process.cwd();
}

module.exports = function (options) {
    var type = options.type;
    var reportFile = options.reportFile;


    if (!reportFile) {
        throw new Error('Missing required parameter `reportFile`');
    }

    if (!type) {
        throw new Error('Missing required parameter `type`');
    }

    if (reports[type]) {
        options.workingDirectory = resolveWorkingDirectory(options.workingDirectory);

        return reports[type](options);
    }

    throw new Error('Unsupported report type. Supported types are ' + Object.keys(reports).join(', '));
};