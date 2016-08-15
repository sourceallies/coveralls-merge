import path from 'path'
import {parseString} from 'xml2js';

import {
    getSourceFromFile,
    getSourceDigest,
    getNumberOfLinesInSource,
    padWithNull
} from '../util/helpers';

function getCoverageFromLine(line) {
    return [line.$.nr, line.$.mi];
}

function convertJavaSourceFileToCoverallsSourceFile(javaSourceFileXML, javaPackage, workingDirectory) {
    const relativeJavaFilePath = path.join(javaPackage, javaSourceFileXML.$.name),
        absoluteJavaFilePath = path.resolve(workingDirectory, relativeJavaFilePath),
        javaFileSource = getSourceFromFile(absoluteJavaFilePath),
        numberOfSourceFileLines = getNumberOfLinesInSource(javaFileSource),
        coverallsSourceFile = {
            name: relativeJavaFilePath,
            coverage: [],
            source_digest: getSourceDigest(javaFileSource)
        };

    let lastLine = 0;

    javaSourceFileXML.line.forEach(line => {
        const [lineNumber, numberOfHits] = getCoverageFromLine(line);

        padWithNull(coverallsSourceFile, lineNumber - lastLine - 1);

        coverallsSourceFile.coverage.push(numberOfHits);

        lastLine = lineNumber;
    });

    padWithNull(coverallsSourceFile, numberOfSourceFileLines - lastLine);

    return coverallsSourceFile;
}

function handleJavaPackage(javaPackageXML, workingDirectory) {
    const javaPackage = javaPackageXML.$.name;

    return javaPackageXML.sourcefile.map(javaSourceFileXML =>
        convertJavaSourceFileToCoverallsSourceFile(javaSourceFileXML, javaPackage, workingDirectory)
    );
}

export default options => new Promise(resolve => {
    const {reportFile, workingDirectory} = options;

    const jacocoReportFilePath = path.resolve(workingDirectory, reportFile),
        jacocoContents = getSourceFromFile(jacocoReportFilePath);

    parseString(jacocoContents, (error, xml) => {
        const result = xml.report.package
            .map(javaPackageXML => handleJavaPackage(javaPackageXML, workingDirectory))
            .reduce((a, b) => a.concat(b));

        resolve(result);
    });
});
