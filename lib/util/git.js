'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getGitInfo = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _child_process = require('child_process');

var USERNAME_EMAIL_REGEX = /(.+)\s<(.+)>/,
    BRANCH_REGEX = /\* (\w+)/,
    COMMIT_MESSAGE_REGEX = /\w+\s(.+)/;

function getHeadId() {
    return (0, _child_process.execSync)('git rev-parse HEAD').toString().trim();
}

function getCommitMessage() {
    var message = (0, _child_process.execSync)('git log -1 --pretty=%B --oneline').toString();

    return message.match(COMMIT_MESSAGE_REGEX)[1];
}

function getAuthorNameAndEmail() {
    var gitShow = (0, _child_process.execSync)('git show --format="%aN <%aE>" HEAD').toString();

    return gitShow.match(USERNAME_EMAIL_REGEX).slice(1, 3);
}

function getCommitterNameAndEmail() {
    var gitShow = (0, _child_process.execSync)('git show --format="%cN <%cE>" HEAD').toString();

    return gitShow.match(USERNAME_EMAIL_REGEX).slice(1, 3);
}

function getHead() {
    var _getAuthorNameAndEmai = getAuthorNameAndEmail();

    var _getAuthorNameAndEmai2 = _slicedToArray(_getAuthorNameAndEmai, 2);

    var author_name = _getAuthorNameAndEmai2[0];
    var author_email = _getAuthorNameAndEmai2[1];

    var _getCommitterNameAndE = getCommitterNameAndEmail();

    var _getCommitterNameAndE2 = _slicedToArray(_getCommitterNameAndE, 2);

    var committer_name = _getCommitterNameAndE2[0];
    var committer_email = _getCommitterNameAndE2[1];


    return {
        id: getHeadId(),
        author_name: author_name,
        author_email: author_email,
        committer_name: committer_name,
        committer_email: committer_email,
        message: getCommitMessage()
    };
}

function getBranch() {
    var branches = (0, _child_process.execSync)('git branch').toString();

    return branches.match(BRANCH_REGEX)[1];
}

function getRemotes() {
    var remotes = (0, _child_process.execSync)('git remote -v').toString().split('\n');

    return remotes.filter(function (remote) {
        return remote.endsWith('(push)');
    }).map(function (remote) {
        var tokens = remote.split(/\s/).filter(function (token) {
            return token.trim() !== '';
        });
        return {
            name: tokens[0],
            url: tokens[1]
        };
    });
}

var getGitInfo = exports.getGitInfo = function getGitInfo() {
    return {
        head: getHead(),
        branch: getBranch(),
        remotes: getRemotes()
    };
};