import path from 'path';

import {
    getRelativeFilePath,
    getNumberOfLinesInSource,
    getSourceFromFile,
    getSourceDigest,
    padWithNull
} from '../util/helpers';

function getCoverageFromLine(line) {
    return line.slice(3).split(',').map(number => Number(number));
}

function convertLcovSectionToCoverallsSourceFile(lcovSection, workingDirectory) {
    const lcovSectionLines = lcovSection.trim().split('\n'),
        coverallsSourceFile = {
            coverage: []
        };

    let numberOfSourceFileLines = 0, lastLine = 1;

    lcovSectionLines.forEach(line => {
        if (line.startsWith('SF:')) {
            const absoluteFilePath = line.slice(3),
                fileSource = getSourceFromFile(absoluteFilePath);

            coverallsSourceFile.name = getRelativeFilePath(absoluteFilePath, workingDirectory);
            coverallsSourceFile.source_digest = getSourceDigest(fileSource);

            numberOfSourceFileLines = getNumberOfLinesInSource(fileSource);
        }

        if (line.startsWith('DA:')) {
            const [lineNumber, numberOfHits] = getCoverageFromLine(line);

            if (lineNumber !== 0) {
                padWithNull(coverallsSourceFile, lineNumber - lastLine - 1);

                coverallsSourceFile.coverage.push(numberOfHits);

                lastLine = lineNumber;
            }
        }
    });

    padWithNull(coverallsSourceFile, numberOfSourceFileLines - lastLine);

    return coverallsSourceFile;
}

export default options => new Promise(resolve => {
    const {reportFile, workingDirectory} = options;

    const lcovReportFilePath = path.resolve(workingDirectory, reportFile),
        lcovContents = getSourceFromFile(lcovReportFilePath),
        lcovSections = lcovContents.split('end_of_record\n'),
        result = lcovSections
            .filter(section => section.trim() !== '')
            .map(section => convertLcovSectionToCoverallsSourceFile(section, workingDirectory));

    resolve(result);
});
