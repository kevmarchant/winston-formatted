const winston = require('..');

const log = winston.loggerFor(module);

// add more transports as required
log.add(new winston.transports.File({ filename: 'error.log', level: 'warn' }));

log.error('Test error');
log.warn('Test warning');
log.info('Test info');
log.verbose('Test verbose');
log.debug('Test debug');
log.silly('Test silly');
log.error('This is a very long message, which should get truncated, hopefully. If not, then I have done something wrong!');
