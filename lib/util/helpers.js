'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRelativeFilePath = getRelativeFilePath;
exports.getNumberOfLinesInSource = getNumberOfLinesInSource;
exports.getSourceFromFile = getSourceFromFile;
exports.getSourceDigest = getSourceDigest;
exports.padWithNull = padWithNull;
exports.getServiceName = getServiceName;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRelativeFilePath(absoluteFilePath, workingDirectory) {
    return absoluteFilePath.slice(workingDirectory.length + 1);
}

function getNumberOfLinesInSource(source) {
    return source.split('\n').length;
}

function getSourceFromFile(filePath) {
    return _fs2.default.readFileSync(filePath, { encoding: 'utf8' });
}

function getSourceDigest(source) {
    return _crypto2.default.createHash('md5').update(source).digest('hex');
}

function padWithNull(coverallsSourceFile, number) {
    for (var i = 0; i < number; i++) {
        coverallsSourceFile.coverage.push(null);
    }
}

function getServiceName() {
    if (process.env.TRAVIS) {
        return 'Travis CI';
    }

    if (process.env.JENKINS_URL) {
        return 'Jenkins';
    }

    if (process.env.CIRCLECI) {
        return 'Circle CI';
    }

    if (process.env.bamboo_planKey) {
        return 'Bamboo';
    }

    if (process.env.TF_BUILD) {
        return 'Team Foundation';
    }

    if (process.env.TEAMCITY_VERSION) {
        return 'TeamCity';
    }

    return process.env.COVERALLS_SERVICE_NAME;
}