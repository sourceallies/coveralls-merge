import merge from '../../src/merge';

import path from 'path';
import {expect} from 'chai';
import Chance from 'chance';

describe('Merge Coveralls Reports', () => {
    let chance;

    const createRandomSourceFile = () => ({
        name: chance.word(),
        [chance.string()]: chance.string()
    });

    const createRandomArgument = () => ({
        prefix: chance.word(),
        report: chance.n(createRandomSourceFile, chance.natural({min: 1, max: 5}))
    });

    before(() => {
        chance = new Chance();
    });

    it('should correctly merge multiple coverage reports together', () => {
        const givenArguments = chance.n(createRandomArgument, chance.natural({min: 1, max: 5})),
            actualResults = merge(givenArguments),
            expectedResults = givenArguments
                .map(argument => {
                    argument.report.forEach(sourceFile => {
                        sourceFile.name = path.join(argument.prefix, sourceFile.name)
                    });
                    return argument.report;
                })
                .reduce((a, b) => a.concat(b));

        expect(actualResults).to.deep.equal(expectedResults);
    });
});
