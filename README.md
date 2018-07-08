# winston-formatted
Wrapper around the the fantastic [`winston` logging library](https://github.com/winstonjs/winston) which adds formatting and colorization, and filename of the file calling the logger method.

This library adds a helper method `loggerFor()` to the `winston` object, which creates and returns a Console transport with formatting:

``` js
const log = winston.loggerFor(module);
```

## Motivation

Having used `winston` in many projects myself, I found that I wanted a nice console output and a bit more information, so I've spent some time to write a wrapper around `winston` to do just that.

## Installation

``` js
npm install --save winston-formatted
```

## Usage

The intention is that you can use `winston` as you normally would, with a formatted console output.

### ES6 modules usage

``` js
import winston from 'winston-formatted';

// passing in module here allows the library to get the calling filename
const log = winston.loggerFor(module);

// using normal methods for logging
log.error('Test error');
log.warn('Test warning');
log.info('Test info');
log.verbose('Test verbose');
log.debug('Test debug');
log.silly('Test silly');
```

## Logging levels

Logging levels in `winston` conform to the severity ordering specified by [RFC5424]: _severity of all levels is assumed to be numerically **ascending** from most important to least important._

``` js
const levels = { 
  error: 0, 
  warn: 1, 
  info: 2, 
  verbose: 3, 
  debug: 4, 
  silly: 5 
};
```

## Advanced usage

The whole `winston` library is passed through, and the logger returned is a normal `winston` Console transport.

Therefore, you can do all the things you normally would with `winston`.  For instance, to add a File transport to your logger, with only 'error' level, do the following:

``` js
import winston from 'winston-formatted';

const log = winston.loggerFor(module);

// add more transports as required
log.add(new winston.transports.File({ filename: 'error.log', level: 'warn' }));
```
For full configuration options, please refer to [`winston`](https://github.com/winstonjs/winston)

## Credits

#### Author: [Kev Marchant](https://github.com/kevmarchant)

Of course, all props go to the original authors of this great library.
