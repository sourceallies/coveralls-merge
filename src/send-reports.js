import {parse} from './parse';
import {merge} from './merge';
import {post} from './post';
import {getProgramConfig} from './util/config';

module.exports = (reports, givenConfig = {}) => {
    const config = getProgramConfig(givenConfig),
        reportPromises = reports.map(report => parse(report, config));

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
