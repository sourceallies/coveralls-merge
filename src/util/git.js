var execSync = require('child_process').execSync;

function getHeadId() {
    return execSync('git rev-parse HEAD').toString().trim();
}

function getNameAndEmailFromLine(line) {
    const tokens = line.split(' '),
        name = tokens[1],
        email = tokens[2].substring(1, tokens[2].length - 1);

    return [name, email];
}

function getHead() {
    const catFile = execSync('git cat-file -p HEAD').toString(),
        catFileLines = catFile.split('\n'),
        catFileSections = catFileLines
            .filter(line => line.trim() !== '')
            .slice(2),
        [author_name, author_email] = getNameAndEmailFromLine(catFileSections[0]),
        [committer_name, committer_email] = getNameAndEmailFromLine(catFileSections[1]);

    return {
        id: getHeadId(),
        author_name,
        author_email,
        committer_name,
        committer_email,
        message: catFileSections[2]
    };
}

function getBranch() {
    const branches = execSync('git branch').toString();

    return branches.match(/\* (\w+)/)[1];
}

function getRemotes() {
    const results = [],
        remotes = execSync('git remote -v').toString().split('\n');

    remotes.forEach(remote => {
        if (remote.endsWith('(push)')) {
            const tokens = remote.split(/\s/).filter(token => token.trim() !== '');
            results.push({
                name: tokens[0],
                url: tokens[1]
            });
        }
    });

    return results;
}

export default () => ({
    head: getHead(),
    branch: getBranch(),
    remotes: getRemotes()
});
