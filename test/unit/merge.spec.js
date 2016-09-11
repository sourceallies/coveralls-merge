import {merge} from '../../src/merge';

import {expect} from 'chai';
import Chance from 'chance';

describe('Merge Coveralls Reports', () => {
    let chance;

    before(() => {
        chance = new Chance();
    });

    const createRandomSourceFile = () => ({
        name: chance.word(),
        [chance.string()]: chance.string()
    });

    it('should correctly merge multiple coverage reports together', () => {
        const randomNumberOfReports = chance.natural({min: 1, max: 5}),
            reports = [],
            expectedMergeResults = [];

        for (let i = 0; i < randomNumberOfReports; i++) {
            const randomNumberOfSourceFiles = chance.natural({min: 1, max: 10}),
                randomSourceFiles = chance.n(createRandomSourceFile, randomNumberOfSourceFiles);

            reports.push(randomSourceFiles);
            randomSourceFiles.forEach(randomSourceFile => expectedMergeResults.push(randomSourceFile));
        }

        const actualMergeResults = merge(reports);

        expect(expectedMergeResults).to.deep.equal(actualMergeResults);
    });
});
