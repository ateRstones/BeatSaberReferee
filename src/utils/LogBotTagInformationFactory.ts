import { ILogInformationFactory } from "ts-logger";
import { Client } from "discord.js";
import LogBotTagInformation from "./LogBotTagInformation";

export default class LogBotTagInformationFactory implements ILogInformationFactory {

    private _client: Client

    constructor(client: Client) {
        this._client = client
    }

    public create(): LogBotTagInformation {
        const tag = this._client.user ? this._client.user.tag : 'Bot not logged in'
        return new LogBotTagInformation(tag)
    }
    
}