import path from 'path';

import parseLcov from './parse/parse-lcov';
import parseJacoco from './parse/parse-jacoco';

const reports = {
    lcov: parseLcov,
    jacoco: parseJacoco
};

function resolveWorkingDirectory(workingDirectory) {
    if (workingDirectory) {
        return path.resolve(process.cwd(), workingDirectory);
    }

    return process.cwd();
}

module.exports = options => {
    const {type, reportFile} = options;

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

    throw new Error(`Unsupported report type. Supported types are ${Object.keys(reports).join(', ')}`);
};
