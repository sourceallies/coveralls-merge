import request from 'request';
import {getServiceName} from './util/helpers';
import {getGitInfo} from './util/git';

module.exports = source_files => {
    const repo_token = process.env.COVERALLS_REPO_TOKEN;

    if (!repo_token) {
        throw new Error('COVERALLS_REPO_TOKEN environment variable not set');
    }

    const url = 'https://coveralls.io/api/v1/jobs',
        json = JSON.stringify({
            repo_token,
            service_name: getServiceName(),
            source_files,
            git: getGitInfo()
        });

    request.post(
        {
            url,
            form: {
                json
            }
        },
        (error, response) => {
            if (error) {
                throw new Error(`Error sending data to Coveralls: ${error}`);
            } else {
                console.log('POST to Coveralls successful!');
                console.log('Job URL:', JSON.parse(response.body).url);
            }
        }
    );
};
