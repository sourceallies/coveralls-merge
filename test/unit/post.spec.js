import {post} from '../../src/post';

import {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';

import * as Helpers from '../../src/util/helpers';
import * as Git from '../../src/util/git';
import request from 'request';

describe('POST Data to Coveralls', () => {
    let chance,
        sandbox;

    beforeEach(() => {
        chance = new Chance();
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should throw an error if the COVERALLS_REPO_TOKEN environment variable is not defined', () => {
        delete process.env.COVERALLS_REPO_TOKEN;

        const badSendCall = () => {
            post({});
        };

        expect(badSendCall).to.throw('COVERALLS_REPO_TOKEN environment variable not set');
    });

    describe('Given the COVERALLS_REPO_TOKEN variable is set', () => {
        let repo_token,
            service_name,
            source_files,
            git;

        beforeEach(() => {
            repo_token = chance.word();
            service_name = chance.word();
            source_files = chance.word();
            git = chance.word();

            process.env.COVERALLS_REPO_TOKEN = repo_token;

            sandbox.stub(Helpers, 'getServiceName').returns(service_name);
            sandbox.stub(Git, 'getGitInfo').returns(git);
            sandbox.stub(request, 'post');
            sandbox.stub(console, 'log');

            post(source_files);
        });

        afterEach(() => {
            delete process.env.COVERALLS_REPO_TOKEN;
        });

        it('should send a POST request to the Coveralls API', () => {
            const expectedPostObject = {
                url: 'https://coveralls.io/api/v1/jobs',
                form: {
                    json: JSON.stringify({
                        repo_token,
                        service_name,
                        source_files,
                        git
                    })
                }
            };

            expect(request.post).to.have.callCount(1);
            expect(request.post).to.be.calledWith(expectedPostObject, sinon.match.func);
        });

        describe('POST request callback', () => {
            let callback;

            beforeEach(() => {
                [, callback] = request.post.firstCall.args;
            });

            it('should throw an error if the request was unsuccessful', () => {
                const error = chance.string(),
                    errorCallback = () => {
                        callback(error);
                    };

                expect(errorCallback).to.throw(`Error sending data to Coveralls: ${error}`);
            });

            it('should not throw an error if the request was successful', () => {
                const successCallback = () => {
                    callback(undefined, {
                        body: JSON.stringify({
                            url: chance.word()
                        })
                    });
                };

                expect(successCallback).to.not.throw(Error);
            });
        });
    });
});
