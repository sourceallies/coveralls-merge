import request from 'request';
import {execSync} from 'child_process';
import {getServiceName} from './util/helpers';
import getGitInfo from './util/git';

module.exports = source_files => {
    const repo_token = process.env.COVERALLS_REPO_TOKEN,
        service_name = getServiceName();

    if (!repo_token) {
        throw new Error('COVERALLS_REPO_TOKEN environment variable not set');
    }

    const url = 'https://coveralls.io/api/v1/jobs',
        commit_sha = execSync('git rev-parse --short HEAD').toString(),
        json = JSON.stringify({
            repo_token,
            service_name,
            source_files,
            commit_sha,
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
                throw new Error('Error sending data to Coveralls: ' + error);
            } else {
                console.log('POST to Coveralls successful!');
                console.log('Job URL:', JSON.parse(response.body).url);
            }
        }
    );
};
