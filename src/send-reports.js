import parse from './parse';
import merge from './merge';
import post from './post';

import path from 'path';

module.exports = (reports, rootDirectory = '.') => {
    const projectRoot = path.resolve(process.cwd(), rootDirectory),
        reportPromises = reports.map(report => parse({...report, projectRoot}));

    Promise.all(reportPromises)
        .then(results => {
            const mergedResults = merge(results);

            post(mergedResults);
        })
        .catch(error => {
            console.log('Error:', error);
            console.log(error.stack);
        });
};
