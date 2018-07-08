import winston from 'winston';
import { config } from 'dotenv';

config();

const { createLogger, transports, format } = winston;
const {
  combine, colorize, timestamp: formatTimestamp, printf
} = format;

const applyTextFormatting = {
  bold: text => `\x1b[1m${text}\x1b[0m`,
  dim: text => `\x1b[2m${text}\x1b[0m`,
  underline: text => `\x1b[4m${text}\x1b[0m`,
  blink: text => `\x1b[5m${text}\x1b[0m`,
  black: text => `\x1b[30m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  green: text => `\x1b[32m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`,
  magenta: text => `\x1b[35m${text}\x1b[0m`,
  cyan: text => `\x1b[36m${text}\x1b[0m`,
  white: text => `\x1b[37m${text}\x1b[0m`
};

const { LOGGER_LEVEL, LOGGER_WIDTH } = process.env;

const defaults = {
  level: LOGGER_LEVEL || 'info',
  handleExceptions: true,
  consoleWidth: LOGGER_WIDTH || process.stdout.columns || 150,
  levelWidth: 7,
  moduleWidthPercentage: 0.2,
  timestampColour: 'cyan',
  moduleColour: 'dim',
  seperatorColour: 'yellow',
  messageColour: 'bold',
  seperator: '=>'
};

winston.loggerFor = (context, opts) => {
  const options = { ...defaults, ...opts };
  return createLogger({
    level: options.level,
    handleExceptions: options.handleExceptions,
    transports: [new transports.Console({
      format: combine(colorize(), formatTimestamp(), printf(({
        timestamp, level, message, ...args
      }) => {
        // timestamp
        const dateTime = timestamp.slice(0, 19).replace('T', ' ');

        // level, which is already colourised
        const lvl = level.padEnd(options.levelWidth + 10);

        // moduleName
        const appDir = process.env.PWD.split('/');
        let moduleName = `/${context.filename.split('/').filter(part => !appDir.includes(part)).join('/')}`;

        // message
        const formattedArgs = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
        let messageAndArgs = `${message} ${formattedArgs}`;

        // get fixed lengths
        const dateTimeWidth = dateTime.length;
        const levelWidth = options.levelWidth + 10;
        const seperatorWidth = options.seperator.length;
        const spacesAndBracketsWidth = 12;

        // calculate space left for moduleName and message
        const spacesLeft = options.consoleWidth - (
          dateTimeWidth + levelWidth + seperatorWidth + spacesAndBracketsWidth
        );
        const moduleWidth = Math.trunc(spacesLeft * options.moduleWidthPercentage);
        const messageWidth = spacesLeft - moduleWidth;

        // truncate moduleName if necessary, pad if necessary
        moduleName = (moduleName.length > moduleWidth) ? `...${moduleName.slice(-(moduleWidth - 3))}` : moduleName;
        moduleName = moduleName.padEnd(moduleWidth);

        // truncate message if necessary, pad if necessary
        messageAndArgs = (messageAndArgs.length > messageWidth)
          ? `${messageAndArgs.substr(0, (messageWidth - 3))}...` : messageAndArgs;
        messageAndArgs = messageAndArgs.padEnd(messageWidth);

        // apply colours
        const dt = applyTextFormatting[options.timestampColour](dateTime);
        const mod = applyTextFormatting[options.moduleColour](moduleName);
        const sep = applyTextFormatting[options.seperatorColour](options.seperator);
        const msg = applyTextFormatting[options.messageColour](messageAndArgs);

        return `${dt} [ ${lvl} ] [ ${mod} ] ${sep} ${msg}`;
      }))
    })]
  });
};

export default winston;
