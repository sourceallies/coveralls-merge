'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('../util/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCoverageFromLine(line) {
    return line.slice(3).split(',').map(function (number) {
        return Number(number);
    });
}

function convertLcovSectionToCoverallsSourceFile(lcovSection, workingDirectory) {
    var lcovSectionLines = lcovSection.trim().split('\n'),
        coverallsSourceFile = {
        coverage: []
    };

    var numberOfSourceFileLines = 0,
        lastLine = 1;

    lcovSectionLines.forEach(function (line) {
        if (line.startsWith('SF:')) {
            var absoluteFilePath = line.slice(3),
                fileSource = (0, _helpers.getSourceFromFile)(absoluteFilePath);

            coverallsSourceFile.name = (0, _helpers.getRelativeFilePath)(absoluteFilePath, workingDirectory);
            coverallsSourceFile.source_digest = (0, _helpers.getSourceDigest)(fileSource);

            numberOfSourceFileLines = (0, _helpers.getNumberOfLinesInSource)(fileSource);
        }

        if (line.startsWith('DA:')) {
            var _getCoverageFromLine = getCoverageFromLine(line);

            var _getCoverageFromLine2 = _slicedToArray(_getCoverageFromLine, 2);

            var lineNumber = _getCoverageFromLine2[0];
            var numberOfHits = _getCoverageFromLine2[1];


            if (lineNumber !== 0) {
                (0, _helpers.padWithNull)(coverallsSourceFile, lineNumber - lastLine - 1);

                coverallsSourceFile.coverage.push(numberOfHits);

                lastLine = lineNumber;
            }
        }
    });

    (0, _helpers.padWithNull)(coverallsSourceFile, numberOfSourceFileLines - lastLine);

    return coverallsSourceFile;
}

exports.default = function (options) {
    return new Promise(function (resolve) {
        var reportFile = options.reportFile;
        var workingDirectory = options.workingDirectory;


        var lcovReportFilePath = _path2.default.resolve(workingDirectory, reportFile),
            lcovContents = (0, _helpers.getSourceFromFile)(lcovReportFilePath),
            lcovSections = lcovContents.split('end_of_record\n'),
            result = lcovSections.filter(function (section) {
            return section.trim() !== '';
        }).map(function (section) {
            return convertLcovSectionToCoverallsSourceFile(section, workingDirectory);
        });

        resolve(result);
    });
};