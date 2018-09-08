const winston = require('..');

const log = winston.loggerFor(module);

log.error('Test error');
log.warn('Test warning');
log.info('Test info');
log.verbose('Test verbose');
log.debug('Test debug');
log.silly('Test silly');
log.debug('This is a very long message, which should get truncated, hopefully. If not, then I have done something wrong!');
