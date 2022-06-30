import log4js from 'log4js';



log4js.configure({
    appenders: {
        console: { type: 'console' },
        ErrorsFile: { type: 'file', filename: 'errors.log' },
        WarnFile: { type: 'file', filename: 'warns.log' },

        loggerConsole: { type: 'logLevelFilter', appender: 'console', level: 'info' },
        loggerErrorsFile: { type: 'logLevelFilter', appender: 'ErrorsFile', level: 'error' },
        loggerWarnFile: { type: 'logLevelFilter', appender: 'WarnFile', level: 'warn' }
    },
    categories: {
        default: {
            appenders: ['loggerConsole'], level: 'all'
        },
        warn: {
            appenders: ['loggerWarnFile'], level: 'warn'
        },
        error: {
            appenders: ['loggerErrorsFile'], level: 'error'
        }
    }
})


export const logger = (category, desc) => {
    if (category === 'warn') {
        return log4js.getLogger('warn').warn(desc);
    }
    else if (category === 'error') {
        return log4js.getLogger('error').error(desc);
    }
    else {
        return log4js.getLogger('default').info(desc);
    }
}

