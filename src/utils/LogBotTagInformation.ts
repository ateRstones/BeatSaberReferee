import { ILogInformation } from "ts-logger";

export default class LogBotTagInformation implements ILogInformation {
    
    private _tag: string

    constructor(tag: string) {
        this._tag = tag
    }

    toLogText(): string {
        return this._tag
    }   

}