# coveralls-merge
A tool that can be used to parse test coverage results, merge reports together, and POST them to coveralls.io.

## The Problem
Coveralls is a great service that allows you to easily display test coverage results for a codebase.
Integration is usually painless, as there are
[several supported languages](https://coveralls.zendesk.com/hc/en-us/sections/200330349-Languages),
and a bunch of user-written modules that can simplify the process of sending your test coverage data to Coveralls.

However, most of these modules work off the assumption that your codebase *only uses one language*, which may
not always be the case. For example, if you're working on a web application that uses JavaScript for client-sided code, and
some other language (Java, Python, Ruby) for server-sided code, and you're interested in displaying coverage
reports for both parts of the codebase, then this tool may be for you.

## Installation

``` bash
npm i @sourceallies/coveralls-merge --save-dev
```

## Usage

### API

```js
const coveralls = require('@sourceallies/coveralls-merge');

// Create reports and options

coveralls.sendReports(reports, options);
```

`reports` is an array of Objects representing a coverage report:

| key              | value                                                                                                                                                                                                                                                                                          | required |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `type`             | String representing the type of coverage report. See [Supported Report Formats](#supported-report-formats)                                                                                                                                                                                       | yes      |
| `reportFile`       | Path to the coverage report file, relative to the project root                                                                                                                                                                                                                                 | yes      |
| `workingDirectory` | Path representing the working directory of the coverage report,  relative to the project root.  This is added as a prefix to the paths specified in the coverage report, and used by Coveralls to determine the location of the source file.  The default value is the project root directory. | no       |

`options` is an optional parameter, which is an Object with the following configuration values:

| key         | value                                                                         | default |
|-------------|-------------------------------------------------------------------------------|---------|
| `projectRoot` | The root directory of the project, relative to the current working directory. | `'.'`   |

### Repo Token

This tool reads the Coveralls repository token from the environment variable `COVERALLS_REPO_TOKEN`.  Failing to set this environment variable will cause the tool to throw an error.

## Supported Report Formats

- LCOV: `lcov`
- JaCoCo XML: `jacoco`

This tool was initially written to support the languages I needed at the time, but it is implemented in a way that
makes adding additional formats painless. If the format you need is not currently supported, feel free to open an
issue or submit a PR to add it yourself.

## License

[Apache Public License v2.0](https://github.com/sourceallies/cover-alls/blob/master/LICENSE)
