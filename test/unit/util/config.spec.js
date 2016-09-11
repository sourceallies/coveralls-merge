import {getProgramConfig, defaultConfig} from '../../../src/util/config';

import {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';

import path from 'path';

describe('getProgramConfig', () => {
    let chance,
        sandbox,
        givenProgramConfig,
        expectedProgramConfig,
        actualProgramConfig,
        currentWorkingDirectory,
        relativeProjectRoot,
        absoluteProjectRoot;

    beforeEach(() => {
        chance = new Chance();
        sandbox = sinon.sandbox.create();

        currentWorkingDirectory = chance.string();
        relativeProjectRoot = chance.string();
        absoluteProjectRoot = chance.string();
        givenProgramConfig = chance.string();

        expectedProgramConfig = {
            projectRoot: relativeProjectRoot
        };

        sandbox.stub(Object, 'assign').returns(expectedProgramConfig);
        sandbox.stub(process, 'cwd').returns(currentWorkingDirectory);
        sandbox.stub(path, 'resolve').returns(absoluteProjectRoot);

        actualProgramConfig = getProgramConfig(givenProgramConfig);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should initialize the program configuration with user-overridden defaults', () => {
        expect(Object.assign).to.have.callCount(1);
        expect(Object.assign).to.be.calledWith({}, defaultConfig, givenProgramConfig);
    });

    it('should resolve the project root to an absolute path', () => {
        expect(path.resolve).to.have.callCount(1);
        expect(path.resolve).to.be.calledWith(currentWorkingDirectory, relativeProjectRoot);

        expect(expectedProgramConfig.projectRoot).to.equal(absoluteProjectRoot);
    });

    it('should return the result', () => {
        expect(expectedProgramConfig).to.deep.equal(actualProgramConfig);
    });
});
