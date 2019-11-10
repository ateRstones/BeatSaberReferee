import { Logger } from "ts-logger"
import Module from "./modules/Module"

export default class ModuleManager {

    private static logger: Logger = new Logger('Module Manager', { useGlobalLogInformationFactories: true })
    private static instance: ModuleManager

    public static getInstance(): ModuleManager {
        if (!this.instance)
            this.instance = new ModuleManager()
        return this.instance
    }

    private constructor() {}

    private setupModule(mod: Module): void {
        mod.setup()
    }

    public setupModules(modules: Module[]): void {
        modules.forEach(this.setupModule)
        ModuleManager.logger.logInfo('All Modules initialized.')
    }

}