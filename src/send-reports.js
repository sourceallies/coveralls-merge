import parse from './parse';
import merge from './merge';
import post from './post';

import path from 'path';

function getProgramConfig(givenConfig) {
    const defaultConfig = {
            projectRoot: '.'
        },
        config = Object.assign({}, defaultConfig, givenConfig);

    config.projectRoot = path.resolve(process.cwd(), config.projectRoot);

    return config;
}

module.exports = (reports, givenConfig = {}) => {
    const config = getProgramConfig(givenConfig),
        reportPromises = reports.map(report => parse({...report, config}));

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
