import path from 'path';

import parseLcov from './parse/parse-lcov';
import parseJacoco from './parse/parse-jacoco';

const reports = {
    lcov: parseLcov,
    jacoco: parseJacoco
};

export default ({reportFile, type, projectRoot, workingDirectory = '.'}) => {
    if (!reportFile) {
        throw new Error('Missing required parameter `reportFile`');
    }

    if (!type) {
        throw new Error('Missing required parameter `type`');
    }

    if (reports[type]) {
        return reports[type]({
            reportFile,
            projectRoot,
            workingDirectory: path.resolve(projectRoot, workingDirectory)
        });
    }

    throw new Error(`Unsupported report type. Supported types are ${Object.keys(reports).join(', ')}`);
};
