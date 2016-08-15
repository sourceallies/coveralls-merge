'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _xml2js = require('xml2js');

var _helpers = require('../util/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCoverageFromLine(line) {
    return [line.$.nr, line.$.mi];
}

function convertJavaSourceFileToCoverallsSourceFile(javaSourceFileXML, javaPackage, workingDirectory) {
    var relativeJavaFilePath = _path2.default.join(javaPackage, javaSourceFileXML.$.name),
        absoluteJavaFilePath = _path2.default.resolve(workingDirectory, relativeJavaFilePath),
        javaFileSource = (0, _helpers.getSourceFromFile)(absoluteJavaFilePath),
        numberOfSourceFileLines = (0, _helpers.getNumberOfLinesInSource)(javaFileSource),
        coverallsSourceFile = {
        name: relativeJavaFilePath,
        coverage: [],
        source_digest: (0, _helpers.getSourceDigest)(javaFileSource)
    };

    var lastLine = 0;

    javaSourceFileXML.line.forEach(function (line) {
        var _getCoverageFromLine = getCoverageFromLine(line);

        var _getCoverageFromLine2 = _slicedToArray(_getCoverageFromLine, 2);

        var lineNumber = _getCoverageFromLine2[0];
        var numberOfHits = _getCoverageFromLine2[1];


        (0, _helpers.padWithNull)(coverallsSourceFile, lineNumber - lastLine - 1);

        coverallsSourceFile.coverage.push(numberOfHits);

        lastLine = lineNumber;
    });

    (0, _helpers.padWithNull)(coverallsSourceFile, numberOfSourceFileLines - lastLine);

    return coverallsSourceFile;
}

function handleJavaPackage(javaPackageXML, workingDirectory) {
    var javaPackage = javaPackageXML.$.name;

    return javaPackageXML.sourcefile.map(function (javaSourceFileXML) {
        return convertJavaSourceFileToCoverallsSourceFile(javaSourceFileXML, javaPackage, workingDirectory);
    });
}

exports.default = function (options) {
    return new Promise(function (resolve) {
        var reportFile = options.reportFile;
        var workingDirectory = options.workingDirectory;


        var jacocoReportFilePath = _path2.default.resolve(workingDirectory, reportFile),
            jacocoContents = (0, _helpers.getSourceFromFile)(jacocoReportFilePath);

        (0, _xml2js.parseString)(jacocoContents, function (error, xml) {
            var result = xml.report.package.map(function (javaPackageXML) {
                return handleJavaPackage(javaPackageXML, workingDirectory);
            }).reduce(function (a, b) {
                return a.concat(b);
            });

            resolve(result);
        });
    });
};