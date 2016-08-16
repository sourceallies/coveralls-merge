'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getGitInfo = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _child_process = require('child_process');

var USERNAME_EMAIL_REGEX = /(?:author|committer)\s((?:\w|\s)+)\s<(.+)>/,
    BRANCH_REGEX = /\* (\w+)/;

function getHeadId() {
    return (0, _child_process.execSync)('git rev-parse HEAD').toString().trim();
}

function getNameAndEmailFromLine(line) {
    return line.match(USERNAME_EMAIL_REGEX).slice(1, 3);
}

function getHead() {
    var catFile = (0, _child_process.execSync)('git cat-file -p HEAD').toString();
    var catFileLines = catFile.split('\n');
    var catFileSections = catFileLines.filter(function (line) {
        return line.trim() !== '';
    }).slice(2);

    var _getNameAndEmailFromL = getNameAndEmailFromLine(catFileSections[0]);

    var _getNameAndEmailFromL2 = _slicedToArray(_getNameAndEmailFromL, 2);

    var author_name = _getNameAndEmailFromL2[0];
    var author_email = _getNameAndEmailFromL2[1];

    var _getNameAndEmailFromL3 = getNameAndEmailFromLine(catFileSections[1]);

    var _getNameAndEmailFromL4 = _slicedToArray(_getNameAndEmailFromL3, 2);

    var committer_name = _getNameAndEmailFromL4[0];
    var committer_email = _getNameAndEmailFromL4[1];


    return {
        id: getHeadId(),
        author_name: author_name,
        author_email: author_email,
        committer_name: committer_name,
        committer_email: committer_email,
        message: catFileSections[2]
    };
}

function getBranch() {
    var branches = (0, _child_process.execSync)('git branch').toString();

    return branches.match(BRANCH_REGEX)[1];
}

function getRemotes() {
    var results = [],
        remotes = (0, _child_process.execSync)('git remote -v').toString().split('\n');

    remotes.forEach(function (remote) {
        if (remote.endsWith('(push)')) {
            var tokens = remote.split(/\s/).filter(function (token) {
                return token.trim() !== '';
            });
            results.push({
                name: tokens[0],
                url: tokens[1]
            });
        }
    });

    return results;
}

var getGitInfo = exports.getGitInfo = function getGitInfo() {
    return {
        head: getHead(),
        branch: getBranch(),
        remotes: getRemotes()
    };
};