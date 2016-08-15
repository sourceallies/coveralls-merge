import path from 'path';

module.exports = args => {
    const result = [];

    args.forEach(arg => {
        const {prefix, report} = arg;

        report.forEach(sourceFile => {
            result.push(Object.assign({}, sourceFile, {
                name: path.join(prefix, sourceFile.name)
            }));
        });
    });

    return result;
};
