import parse from '../../src/parse';

import chai, {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

import path from 'path';

describe('Parse entry point', () => {
    let chance,
        sandbox;

    before(() => {
        chai.use(sinonChai);
        proxyquire.noCallThru();
    });

    beforeEach(() => {
        chance = new Chance();
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should throw an error when a report file is not given', () => {
        const badParseCall = () => {
            parse({});
        };

        expect(badParseCall).to.throw('Missing required parameter `reportFile`');
    });

    it('should throw an error when a report type is not given', () => {
        const badParseCall = () => {
            parse({
                reportFile: chance.string()
            });
        };

        expect(badParseCall).to.throw('Missing required parameter `type`');
    });

    it('should throw an error when an invalid report type is given', () => {
        const badParseCall = () => {
            parse({
                reportFile: chance.string(),
                type: chance.string()
            });
        };

        expect(badParseCall).to.throw('Unsupported report type. Supported types are lcov, jacoco');
    });

    describe('Given the required parameters are present', () => {
        let options,
            pathResolveResult,
            currentWorkingDirectory,
            parseWithMocks,
            parseLcovStub,
            parseLcovStubResult,
            parseJacocoStub,
            parseJacocoStubResult;

        function assertStubWasCalledWithOptions(options) {
            switch (options.type) {
                case 'lcov':
                    expect(parseLcovStub).to.have.callCount(1);
                    expect(parseLcovStub).to.be.calledWith(options);
                    break;
                case 'jacoco':
                    expect(parseJacocoStub).to.have.callCount(1);
                    expect(parseJacocoStub).to.be.calledWith(options);
            }
        }

        beforeEach(() => {
            options = {
                type: chance.pick(['lcov', 'jacoco']),
                reportFile: chance.string()
            };

            pathResolveResult = chance.string();
            currentWorkingDirectory = chance.string();
            parseLcovStubResult = chance.string();
            parseJacocoStubResult = chance.string();

            parseLcovStub = sandbox.stub().returns(parseLcovStubResult);
            parseJacocoStub = sandbox.stub().returns(parseJacocoStubResult);

            parseWithMocks = proxyquire('../../src/parse', {
                './parse/parse-lcov': parseLcovStub,
                './parse/parse-jacoco': parseJacocoStub
            });

            sandbox.stub(path, 'resolve').returns(pathResolveResult);
            sandbox.stub(process, 'cwd').returns(currentWorkingDirectory);
        });

        it('should resolve the working directory as the current working directory if not given', () => {
            parseWithMocks(options);

            const newOptions = Object.assign({}, options, {
                workingDirectory: currentWorkingDirectory
            });

            expect(path.resolve).to.have.callCount(0);
            expect(process.cwd).to.have.callCount(1);

            assertStubWasCalledWithOptions(newOptions);
        });

        it('should append the current directory to the given working directory', () => {
            const workingDirectory = chance.string(),
                newOptions = Object.assign({}, options, {
                    workingDirectory: pathResolveResult
                });

            options.workingDirectory = workingDirectory;

            parseWithMocks(options);

            expect(process.cwd).to.have.callCount(1);

            expect(path.resolve).to.have.callCount(1);
            expect(path.resolve).to.be.calledWith(currentWorkingDirectory, workingDirectory);

            assertStubWasCalledWithOptions(newOptions);
        });
    });
});