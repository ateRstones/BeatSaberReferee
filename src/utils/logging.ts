
export enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR
}

type LogLevelStrings = keyof typeof LogLevel

export default class Logger {

    private static createdLoggers: Map<string, Logger> = new Map()

    public static getLogger(id: string): Logger {
        if(!this.createdLoggers.has(id)) [
            this.createdLoggers.set(id, new Logger(id))
        ]

        return <Logger> this.createdLoggers.get(id)
    }

    private currentLogLevel: LogLevel = LogLevel.WARNING
    private prefix: string = "DefaultPrefix"
    private id: string

    private constructor(id: string) {
        this.id = id
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix
    }

    public setLogLevel(logLevel: LogLevel | string) {
        let logLevelRes: LogLevel = LogLevel.WARNING

        if(typeof(logLevel) == "string") {
            logLevelRes = LogLevel[<keyof typeof LogLevel>logLevel]
            if(typeof(logLevelRes) == "undefined") {
                this.warning(`Unknown loglevel to set to ${logLevel}. Using WARNING.`)
                logLevelRes = LogLevel.WARNING
            }
        } else {
            logLevelRes = logLevel
        }

        this.currentLogLevel = logLevelRes
        this.debug(`Setting LogLevel to ${LogLevel[logLevelRes]}`)
    }
    
    public debug(message: string, error?: Error) {
        this.log(LogLevel.DEBUG, message, error)
    }

    public info(message: string, error?: Error) {
        this.log(LogLevel.INFO, message, error)
    }

    public warning(message: string, error?: Error) {
        this.log(LogLevel.WARNING, message, error)
    }

    public error(message: string, error?: Error) {
        this.log(LogLevel.ERROR, message, error)
    }

    public log(logLevel: LogLevel, message: string, error: Error | undefined) {
        if(logLevel >= this.currentLogLevel) {
            let output: string = `[${this.prefix} - ${LogLevel[logLevel]} - ${new Date().toLocaleString()}] ${message}`
            
            if(error) {
                output += `: ${error.name} ${error.message}\n${error.stack}`
            }

            console.log(output)
        }
    }

}