import fs from 'fs';
import crypto from 'crypto';

export function getRelativeFilePath(absoluteFilePath, workingDirectory) {
    return absoluteFilePath.slice(workingDirectory.length + 1);
}

export function getNumberOfLinesInSource(source) {
    return source.split('\n').length;
}

export function getSourceFromFile(filePath) {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
}

export function getSourceDigest(source) {
    return crypto.createHash('md5').update(source).digest('hex');
}

export function padWithNull(coverallsSourceFile, number) {
    for (let i = 0; i < number; i++) {
        coverallsSourceFile.coverage.push(null);
    }
}

export function getServiceName() {
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
