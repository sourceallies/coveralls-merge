# cover-alls
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
npm i cover-alls --save-dev
```

## API


`parse()`

Given a report type and a report file, return a coverage report consisting of an array of
[Coveralls Source Files](https://coveralls.zendesk.com/hc/en-us/articles/201774865-API-Introduction).

`merge()`

Given one or more coverage reports returned from `parse()`, combine these reports together.

`send()`

Given the result returned from `merge()`, POST the combined reports to Coveralls.

## Supported Report Formats

- LCOV
- JaCoCo XML

This tool was initially written to support the languages I needed at the time, but it is implemented in a way that
makes adding additional formats painless. If the format you need is not currently supported, feel free to open an
issue or submit a PR to add it yourself.

## License

[Apache Public License v2.0](https://github.com/sourceallies/cover-alls/blob/master/LICENSE)