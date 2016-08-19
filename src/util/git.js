import {execSync} from 'child_process';

const USERNAME_EMAIL_REGEX = /(.+)\s<(.+)>/,
    BRANCH_REGEX = /\* (\w+)/,
    COMMIT_MESSAGE_REGEX = /\w+\s(.+)/;

function getHeadId() {
    return execSync('git rev-parse HEAD').toString().trim();
}

function getCommitMessage() {
    const message = execSync('git log -1 --pretty=%B --oneline').toString();

    return message.match(COMMIT_MESSAGE_REGEX)[1];
}

function getAuthorNameAndEmail() {
    const gitShow = execSync('git show --format="%aN <%aE>" HEAD').toString();

    return gitShow.match(USERNAME_EMAIL_REGEX).slice(1, 3);
}

function getCommitterNameAndEmail() {
    const gitShow = execSync('git show --format="%cN <%cE>" HEAD').toString();

    return gitShow.match(USERNAME_EMAIL_REGEX).slice(1, 3);
}

function getHead() {
    const [author_name, author_email] = getAuthorNameAndEmail(),
        [committer_name, committer_email] = getCommitterNameAndEmail();

    return {
        id: getHeadId(),
        author_name,
        author_email,
        committer_name,
        committer_email,
        message: getCommitMessage()
    };
}

function getBranch() {
    const branches = execSync('git branch').toString();

    return branches.match(BRANCH_REGEX)[1];
}

function getRemotes() {
    const remotes = execSync('git remote -v').toString().split('\n');

    return remotes
        .filter(remote => remote.endsWith('(push)'))
        .map(remote => {
            const tokens = remote.split(/\s/).filter(token => token.trim() !== '');
            return {
                name: tokens[0],
                url: tokens[1]
            }
        });
}

export const getGitInfo = () => ({
    head: getHead(),
    branch: getBranch(),
    remotes: getRemotes()
});
