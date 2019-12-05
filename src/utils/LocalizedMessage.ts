import c from 'config'
import fs from "fs"
import Logger from "./logging"

export default class LocalizedMessage {
    private static instance: LocalizedMessage
    private static readonly defaultLang: string = "en"

    public static initialize() {
        this.getInstance()
    }

    public static getInstance(): LocalizedMessage {
        if(this.instance === undefined) {
            this.instance = new LocalizedMessage("localization.json")
        }

        return this.instance
    }

    public static getParsed(key: string, replace: any): string {
        return this.getInstance().getLocalizedParsed(key, replace);
    }

    public static getLocalized(key: string): string {
        return this.getInstance().getLocalizedString(key);
    }

    private baseJson: any
    private language: string
    private logger: Logger = Logger.getLogger("beatsaber")

    private constructor(inputFile: string) {
        if(fs.existsSync(inputFile)) {
            let input = fs.readFileSync(inputFile, 'utf-8')
            this.baseJson = JSON.parse(input)
            this.logger.debug(`Loaded localization input file ${inputFile}`)
            this.language = c.get<string>("language")
            this.logger.debug(`Selected language ${this.language}`)
        } else {
            throw new Error(`Could not find file ${inputFile} for localized messages!`)
        }
    }

    public getLocalizedString(key: string): string {
        let currentObject = this.baseJson
        let splitKey = key.split(".")
        for(let x in splitKey) {
            currentObject = currentObject[splitKey[x]]
            if(currentObject === undefined) {
                this.logger.debug(`Missing value for localization key ${key}`)
                return `THIS SHOULD NOT BE SHOW: MISSING LOCALIZATION KEY ${key}`
            }
        }
        let output = currentObject[this.language]
        
        if(output === undefined) {
            this.logger.debug(`Missing ${this.language} value for key ${key} -> Using default`)
            output = currentObject[LocalizedMessage.defaultLang]
        }

        if(output === undefined) {
            this.logger.debug(`Missing default ${LocalizedMessage.defaultLang} value for key ${key} too`)
            output = `NO MATCHING LOCALIZED MESSAGE DEFINED FOR LANGUAGE ${this.language} AND DEFAULT LANGUAGE ${LocalizedMessage.defaultLang}`
        }

        return output
    }

    public getLocalizedParsed(key: string, replace: any): string {
        let localized = this.getLocalizedString(key)
        for(let repl in replace) {
            localized = localized.replace(new RegExp(`%${repl}%`, "g"), replace[repl])
        }
        return localized
    }

}