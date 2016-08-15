'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (args) {
    var result = [];

    args.forEach(function (arg) {
        var prefix = arg.prefix;
        var report = arg.report;


        report.forEach(function (sourceFile) {
            result.push(Object.assign({}, sourceFile, {
                name: _path2.default.join(prefix, sourceFile.name)
            }));
        });
    });

    return result;
};