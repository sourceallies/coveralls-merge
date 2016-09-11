import path from 'path';

export const defaultConfig = {
    projectRoot: '.'
};

export const getProgramConfig = givenConfig => {
    const config = Object.assign({}, defaultConfig, givenConfig);

    config.projectRoot = path.resolve(process.cwd(), config.projectRoot);

    return config;
};
