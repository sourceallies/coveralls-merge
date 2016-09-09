import {
    getRelativeFilePath,
    getNumberOfLinesInSource,
    getSourceFromFile,
    getSourceDigest,
    padWithNull,
    getServiceName
} from '../../../src/util/helpers';

import {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';
import {cloneDeep} from 'lodash';

import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

describe('Helpers', () => {
    let chance,
        sandbox;

    beforeEach(() => {
        chance = new Chance();
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should get the relative file path given the absolute path and the working directory', () => {
        const randomFolders = chance.n(chance.word, chance.natural({min: 5, max: 10})),
            randomIndex = chance.natural({min: 1, max: randomFolders.length - 2}),
            absoluteFilePath = path.join(...randomFolders),
            workingDirectory = path.join(...randomFolders.slice(0, randomIndex)),
            expectedResult = path.join(...randomFolders.slice(randomIndex)),
            actualResult = getRelativeFilePath(absoluteFilePath, workingDirectory);

        expect(actualResult).to.equal(expectedResult);
    });

    it('should return the number of newline characters given a source blob', () => {
        const randomNumberOfLines = chance.natural({min: 5, max: 30}),
            randomParagraphs = chance.n(chance.paragraph, randomNumberOfLines),
            randomSourceBlob = randomParagraphs.join('\n'),
            result = getNumberOfLinesInSource(randomSourceBlob);

        expect(result).to.equal(randomNumberOfLines);
    });

    it('should get the contents of a file on the system', () => {
        const fileSource = chance.string(),
            randomFilePath = chance.string();

        sandbox.stub(fs, 'readFileSync').returns(fileSource);

        const result = getSourceFromFile(randomFilePath);

        expect(fs.readFileSync).to.have.callCount(1);
        expect(fs.readFileSync).to.be.calledWith(randomFilePath, {encoding: 'utf8'});

        expect(result).to.equal(fileSource);
    });

    it('should convert a source blob to an md5 digest', () => {
        const randomSourceBlob = chance.string(),
            digestResult = chance.string(),
            digestStub = sandbox.stub().returns(digestResult),
            updateStub = sandbox.stub().returns({
                digest: digestStub
            });

        sandbox.stub(crypto, 'createHash').returns({
            update: updateStub
        });

        const result = getSourceDigest(randomSourceBlob);

        expect(crypto.createHash).to.have.callCount(1);
        expect(crypto.createHash).to.be.calledWith('md5');

        expect(updateStub).to.have.callCount(1);
        expect(updateStub).to.be.calledWith(randomSourceBlob);

        expect(digestStub).to.have.callCount(1);
        expect(digestStub).to.be.calledWith('hex');

        expect(result).to.equal(digestResult);
    });

    it('should pad a given array with null values', () => {
        const initialLength = chance.natural({min: 5, max: 10}),
            initialCoverageArray = chance.n(chance.string, initialLength),
            coverallsSourceFile = {
                coverage: cloneDeep(initialCoverageArray)
            },
            randomNumber = chance.natural({min: 10, max: 20});

        padWithNull(coverallsSourceFile, randomNumber);

        expect(coverallsSourceFile.coverage).to.have.length(initialLength + randomNumber);
        expect(coverallsSourceFile.coverage.splice(0, initialLength)).to.deep.equal(initialCoverageArray);

        for (let i = initialLength; i < coverallsSourceFile.coverage.length; i++) {
            expect(coverallsSourceFile.coverage[i]).to.equal(null);
        }
    });

    describe('getServiceName()', () => {
        function checkEnvironmentVariable(variable, expectedResult) {
            process.env[variable] = chance.string();
            const actualResult = getServiceName();

            expect(actualResult).to.equal(expectedResult);
            delete process.env[variable];
        }

        it('should return the correct CI that this is being run on', () => {
            checkEnvironmentVariable('TRAVIS', 'Travis CI');
            checkEnvironmentVariable('JENKINS_URL', 'Jenkins');
            checkEnvironmentVariable('CIRCLECI', 'Circle CI');
            checkEnvironmentVariable('bamboo_planKey', 'Bamboo');
            checkEnvironmentVariable('TF_BUILD', 'Team Foundation');
            checkEnvironmentVariable('TEAMCITY_VERSION', 'TeamCity');
        });

        it('should default to the COVERALLS_SERVICE_NAME environment variable', () => {
            const randomServiceName = chance.string();

            process.env.COVERALLS_SERVICE_NAME = randomServiceName;

            const result = getServiceName();

            expect(result).to.equal(randomServiceName);

            delete process.env.COVERALLS_SERVICE_NAME;
        });
    });
});
