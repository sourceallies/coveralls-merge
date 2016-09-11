import sendReports from '../../src/send-reports';
import * as parseFunc from '../../src/parse';
import * as mergeFunc from '../../src/merge';
import * as postFunc from '../../src/post';
import * as config from '../../src/util/config';

import {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';

describe('sendReports', () => {
    let chance,
        sandbox,
        givenReports,
        parseResultPromise,
        parseResultResolve,
        parseStub,
        mergeResults,
        mergeStub,
        postStub,
        givenConfig,
        programConfig,
        getProgramConfigStub;

    before(() => {
        chance = new Chance();
        sandbox = sinon.sandbox.create();

        givenConfig = chance.string();
        programConfig = chance.string();
        mergeResults = chance.string();
        givenReports = chance.n(chance.string, chance.natural({min: 1, max: 4}));

        parseResultPromise = new Promise(resolve => {
            parseResultResolve = resolve;
        });

        sandbox.spy(Promise, 'all');
        parseStub = sandbox.stub(parseFunc, 'parse').returns(parseResultPromise);
        mergeStub = sandbox.stub(mergeFunc, 'merge').returns(mergeResults);
        postStub = sandbox.stub(postFunc, 'post');
        getProgramConfigStub = sandbox.stub(config, 'getProgramConfig').returns(programConfig);

        sendReports(givenReports, givenConfig);
    });

    after(() => {
        sandbox.restore();
    });

    it('should get the program configuration', () => {
        expect(getProgramConfigStub).to.have.callCount(1);
        expect(getProgramConfigStub).to.be.calledWith(givenConfig);
    });

    it('should parse each report', () => {
        expect(parseStub).to.have.callCount(givenReports.length);

        givenReports.forEach(report => {
            expect(parseStub).to.be.calledWith(report, programConfig);
        });
    });

    it('should resolve each Promise returned by `parse()`', () => {
        expect(Promise.all).to.have.callCount(1);
        expect(Promise.all).to.be.calledWith(new Array(givenReports.length).fill(parseResultPromise));
    });

    describe('Given the Promises have been resolved', () => {
        let promiseResult,
            promiseAllResults;

        before(done => {
            promiseResult = chance.string();
            promiseAllResults = new Array(givenReports.length).fill(promiseResult);

            parseResultPromise.then(() => {
                done();
            });

            parseResultResolve(promiseResult);
        });

        it('should merge the results together', () => {
            expect(mergeStub).to.have.callCount(1);
            expect(mergeStub).to.be.calledWith(promiseAllResults);
        });

        it('should POST the results to Coveralls.io', () => {
            expect(postStub).to.have.callCount(1);
            expect(postStub).to.be.calledWith(mergeResults);
        });
    });
});
